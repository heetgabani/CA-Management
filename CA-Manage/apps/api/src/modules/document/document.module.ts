import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads/temp' }),
    StorageModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
