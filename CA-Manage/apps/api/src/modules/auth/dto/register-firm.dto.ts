import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterFirmDto {
  @ApiProperty() @IsString() @MinLength(2) @MaxLength(100) firmName: string;
  @ApiProperty() @IsEmail() firmEmail: string;
  @ApiProperty() @IsOptional() @IsString() firmPhone?: string;
  @ApiProperty() @IsOptional() @IsString() gstNumber?: string;
  @ApiProperty() @IsOptional() @IsString() pan?: string;
  @ApiProperty() @IsString() @MinLength(2) firstName: string;
  @ApiProperty() @IsString() @MinLength(2) lastName: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
}
