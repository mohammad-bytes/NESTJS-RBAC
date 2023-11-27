import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class BaseResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  statusCode: number;

  @ApiProperty()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ readOnly: false })
  @IsOptional()
  data?: any;

  @ApiProperty({ readOnly: false })
  @IsOptional()
  count?: number;

  @ApiProperty({ readOnly: false })
  @IsOptional()
  access_token?: string;
}
