import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Test@gmail.com' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Test@123' })
  password: string;
}
