import { Controller, Get, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from 'src/helper/decorator/user.decorator';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async me(@GetUser() user){
    return await this.meService.me(user);
  }
}
