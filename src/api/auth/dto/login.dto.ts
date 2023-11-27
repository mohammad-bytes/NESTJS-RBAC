import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@gmail.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Test@123' })
  password: string;
}
