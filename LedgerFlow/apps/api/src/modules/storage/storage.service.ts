import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client | null = null;
  private readonly provider: string;
  private readonly bucket: string;
  private readonly localPath: string;

  constructor(private config: ConfigService) {
    this.provider = config.get('STORAGE_PROVIDER', 'local');
    this.bucket = config.get('AWS_S3_BUCKET', 'ledgerflow-docs');
    this.localPath = config.get('LOCAL_STORAGE_PATH', './uploads');

    if (this.provider !== 'local') {
      this.s3Client = new S3Client({
        region: config.get('AWS_REGION', 'ap-south-1'),
        credentials: {
          accessKeyId: config.get('AWS_ACCESS_KEY_ID', ''),
          secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY', ''),
        },
        ...(config.get('AWS_S3_ENDPOINT') && { endpoint: config.get('AWS_S3_ENDPOINT') }),
      });
    }
  }

  async upload(
    file: Express.Multer.File,
    storageKey: string,
  ): Promise<{ provider: string; key: string }> {
    if (this.provider === 'local') {
      return this.uploadLocal(file, storageKey);
    }
    return this.uploadS3(file, storageKey);
  }

  private async uploadLocal(file: Express.Multer.File, key: string) {
    const filePath = path.join(this.localPath, key);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, file.buffer || fs.readFileSync(file.path));

    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);

    return { provider: 'LOCAL', key };
  }

  private async uploadS3(file: Express.Multer.File, key: string) {
    const buffer = file.buffer || fs.readFileSync(file.path);
    await this.s3Client!.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
        ServerSideEncryption: 'AES256',
      }),
    );

    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return { provider: 'AWS_S3', key };
  }

  async getSignedUrl(storageKey: string, expiresInSeconds = 3600): Promise<string> {
    if (this.provider === 'local') {
      return `/api/v1/storage/local/${encodeURIComponent(storageKey)}`;
    }

    const command = new GetObjectCommand({ Bucket: this.bucket, Key: storageKey });
    return getSignedUrl(this.s3Client!, command, { expiresIn: expiresInSeconds });
  }

  async delete(storageKey: string): Promise<void> {
    if (this.provider === 'local') {
      const filePath = path.join(this.localPath, storageKey);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return;
    }

    await this.s3Client!.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: storageKey }),
    );
  }
}
