import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Read' })
  name: string;

  // @IsNotEmpty()
  // @ApiProperty({ example: 1 })
  // module: number;
}
