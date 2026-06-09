import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Storage')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'storage', version: '1' })
export class StorageController {
  constructor(private config: ConfigService) {}

  @Get('local/:key(*)')
  serveLocal(@Param('key') key: string, @Res() res: Response) {
    const localPath = this.config.get('LOCAL_STORAGE_PATH', './uploads');
    const filePath = path.join(localPath, decodeURIComponent(key));
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    return res.sendFile(path.resolve(filePath));
  }
}
