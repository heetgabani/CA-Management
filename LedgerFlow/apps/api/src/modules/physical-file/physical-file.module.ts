import { Module } from '@nestjs/common';
import { PhysicalFileController } from './physical-file.controller';
import { PhysicalFileService } from './physical-file.service';

@Module({
  controllers: [PhysicalFileController],
  providers: [PhysicalFileService],
  exports: [PhysicalFileService],
})
export class PhysicalFileModule {}
