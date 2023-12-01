import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
@Throttle({})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto): Promise<BaseResponseDto> {
    return await this.authService.login(body);
  }

  @Post('/activate/:key')
  async activate(@Param('key') key: string): Promise<BaseResponseDto> {
    return await this.authService.activateAccount(key);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.authService.forgotPassword(email);
  }

  @Post('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() { password }: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, password);
  }
}
