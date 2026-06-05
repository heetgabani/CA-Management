import { IsString, IsOptional, IsEmail, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ enum: ['INDIVIDUAL','PROPRIETORSHIP','PARTNERSHIP','LLP','PRIVATE_LIMITED','PUBLIC_LIMITED','TRUST','NGO','HUF'] })
  @IsEnum(['INDIVIDUAL','PROPRIETORSHIP','PARTNERSHIP','LLP','PRIVATE_LIMITED','PUBLIC_LIMITED','TRUST','NGO','HUF'])
  clientType: string;

  @ApiProperty() @IsString() displayName: string;

  @ApiPropertyOptional() @IsOptional() @IsString() clientCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tradeName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() primaryMobile?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alternateMobile?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() primaryEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() alternateEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pan?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aadhaar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gstin?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tan?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cin?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() llpin?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() iec?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() leadSource?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedPartnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedAccountantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() incorporationDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateOfBirth?: string;
}
