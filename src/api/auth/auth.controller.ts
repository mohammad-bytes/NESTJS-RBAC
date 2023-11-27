import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
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
}
