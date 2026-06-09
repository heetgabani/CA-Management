import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './modules/auth/auth.module';
import { FirmModule } from './modules/firm/firm.module';
import { UserModule } from './modules/user/user.module';
import { ClientModule } from './modules/client/client.module';
import { DocumentModule } from './modules/document/document.module';
import { FolderModule } from './modules/folder/folder.module';
import { TaskModule } from './modules/task/task.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { ReminderModule } from './modules/reminder/reminder.module';
import { PhysicalFileModule } from './modules/physical-file/physical-file.module';
import { NotificationModule } from './modules/notification/notification.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SearchModule } from './modules/search/search.module';
import { AuditModule } from './modules/audit/audit.module';
import { StorageModule } from './modules/storage/storage.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        ttl: config.get('RATE_LIMIT_TTL', 60) * 1000,
        limit: config.get('RATE_LIMIT_MAX', 100),
      }],
    }),

    EventEmitterModule.forRoot({ wildcard: true }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = new URL(config.get('REDIS_URL', 'redis://localhost:6379'));
        return {
          redis: {
            host: redisUrl.hostname,
            port: parseInt(redisUrl.port || '6379', 10),
            password: redisUrl.password || undefined,
          },
          defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
        };
      },
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: 'ioredis',
        host: 'localhost',
        port: 6379,
        ttl: 300,
      }),
    }),

    DatabaseModule,
    AuthModule,
    FirmModule,
    UserModule,
    ClientModule,
    DocumentModule,
    FolderModule,
    TaskModule,
    ComplianceModule,
    ReminderModule,
    PhysicalFileModule,
    NotificationModule,
    DashboardModule,
    SearchModule,
    AuditModule,
    StorageModule,
    ReportsModule,
  ],
})
export class AppModule {}
