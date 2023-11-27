import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RolePermissionDto {
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  role: number;

  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  module: number;

  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  permission: number;
}
