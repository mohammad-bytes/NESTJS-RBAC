import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Mohammad' })
  first_name: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Husain' })
  last_name: string;

  @IsOptional()
  @ApiProperty({ example: '' })
  phone?: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'mohammad@gmail.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  role: number;
}
