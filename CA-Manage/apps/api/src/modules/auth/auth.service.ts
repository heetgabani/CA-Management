import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../config/prisma.service';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { RegisterFirmDto } from './dto/register-firm.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async registerFirm(dto: RegisterFirmDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('Email already registered');

    // Create tenant slug
    const slug = dto.firmName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 30) + '-' + randomBytes(3).toString('hex');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create tenant, firm, and owner user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { slug, name: dto.firmName },
      });

      const firm = await tx.firm.create({
        data: {
          tenantId: tenant.id,
          name: dto.firmName,
          email: dto.firmEmail,
          phone: dto.firmPhone,
          gstNumber: dto.gstNumber,
          pan: dto.pan,
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          firmId: firm.id,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: 'FIRM_OWNER',
          status: 'PENDING_VERIFICATION',
        },
      });

      // Create default document folders template
      const systemFolders = ['KYC', 'GST', 'Income Tax', 'Audit', 'Bank Statements', 'Agreements', 'Licenses', 'ROC', 'DSC'];

      return { tenant, firm, user, systemFolders };
    });

    await this.sendOtp(dto.email, 'EMAIL_VERIFICATION');

    return {
      message: 'Registration successful. Please verify your email.',
      email: dto.email,
    };
  }

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    // Prefer ACTIVE + verified users; falls back to first match (handles multi-tenant same email)
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
      include: { firm: { select: { id: true, name: true } } },
      orderBy: [
        { isEmailVerified: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (user.status === 'SUSPENDED') throw new UnauthorizedException('Account suspended');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    if (!user.isEmailVerified) {
      await this.sendOtp(user.email, 'EMAIL_VERIFICATION');
      throw new UnauthorizedException('Email not verified. OTP sent to your email.');
    }

    const tokens = await this.generateTokens(user);

    // Save refresh token session
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        tenantId: user.tenantId,
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        ipAddress: ip,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: ip },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: user.id,
        description: 'User logged in',
        ipAddress: ip,
        userAgent,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        firmId: user.firmId,
        firmName: user.firm?.name,
        tenantId: user.tenantId,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      const session = await this.prisma.userSession.findFirst({
        where: { userId: payload.sub, isActive: true },
        include: { user: true },
      });

      if (!session) throw new UnauthorizedException('Session expired');

      const isValid = await bcrypt.compare(dto.refreshToken, session.refreshToken);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const tokens = await this.generateTokens(session.user);

      // Rotate refresh token
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 10) },
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const sessions = await this.prisma.userSession.findMany({
        where: { userId, isActive: true },
      });
      for (const session of sessions) {
        const isMatch = await bcrypt.compare(refreshToken, session.refreshToken);
        if (isMatch) {
          await this.prisma.userSession.update({
            where: { id: session.id },
            data: { isActive: false },
          });
          break;
        }
      }
    } else {
      await this.prisma.userSession.updateMany({
        where: { userId },
        data: { isActive: false },
      });
    }
  }

  async sendOtp(email: string, purpose: string) {
    const otp = '8888'; // DEV: fixed OTP — replace with random + email delivery in production
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { email, otp: await bcrypt.hash(otp, 10), purpose, expiresAt },
    });

    console.log(`[DEV] OTP for ${email} (${purpose}): ${otp}`);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        email: dto.email,
        purpose: dto.purpose,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) throw new BadRequestException('Invalid or expired OTP');
    if (otpRecord.attempts >= 5) throw new BadRequestException('Too many attempts');

    const isValid = await bcrypt.compare(dto.otp, otpRecord.otp);
    if (!isValid) {
      await this.prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    if (dto.purpose === 'EMAIL_VERIFICATION') {
      await this.prisma.user.updateMany({
        where: { email: dto.email },
        data: { isEmailVerified: true, status: 'ACTIVE' },
      });
    }

    return { message: 'OTP verified successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({ where: { email: dto.email } });
    if (!user) return { message: 'If the email exists, a reset link has been sent' };

    await this.sendOtp(dto.email, 'PASSWORD_RESET');
    return { message: 'Password reset OTP sent to your email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    await this.verifyOtp({ email: dto.email, otp: dto.otp, purpose: 'PASSWORD_RESET' });

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.updateMany({
      where: { email: dto.email },
      data: { passwordHash, passwordChangedAt: new Date() },
    });

    return { message: 'Password reset successful' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      firmId: user.firmId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
