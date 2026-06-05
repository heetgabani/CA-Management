import { IsOptional, IsString, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() folderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['KYC','GST','INCOME_TAX','AUDIT','BANK_STATEMENTS','AGREEMENTS','LICENSES','ROC','DSC','TDS','FINANCIAL_STATEMENTS','OTHER']) category?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() financialYear?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() remarks?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
}
