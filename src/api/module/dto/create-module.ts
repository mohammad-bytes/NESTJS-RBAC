import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Dashboard' })
  name: string;

  @IsOptional()
  @ApiProperty({ example: '' })
  description?: string;
}
