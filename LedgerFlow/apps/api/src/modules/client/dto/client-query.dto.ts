import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ClientQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() clientType?: string;
  @IsOptional() @IsEnum(['ACTIVE','INACTIVE','CLOSED','PROSPECT']) status?: string;
  @IsOptional() @IsString() assignedPartnerId?: string;
  @IsOptional() @IsString() assignedAccountantId?: string;
  @IsOptional() @IsString() sortBy?: string = 'createdAt';
  @IsOptional() @IsEnum(['asc','desc']) sortOrder?: 'asc' | 'desc' = 'desc';
}
