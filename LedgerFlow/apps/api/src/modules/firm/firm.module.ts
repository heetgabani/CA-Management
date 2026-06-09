import { Module } from '@nestjs/common';
import { FirmController } from './firm.controller';
import { FirmService } from './firm.service';
import { DatabaseModule } from '../../config/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FirmController],
  providers: [FirmService],
  exports: [FirmService],
})
export class FirmModule {}
