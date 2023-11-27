import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'admin' })
  name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  description: string;
}
