import { Controller, Get, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/helper/decorator/user.decorator';
import { PermissionGuard } from 'src/helper/guard/permission.guard';
import { PermissionModule } from 'src/helper/decorator/permission.decorator';
import { Permission } from 'src/enum/permission.enum';
import { ModuleName } from 'src/enum/module.enum';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @PermissionModule(ModuleName.ME, Permission.READ)
  async me(@GetUser() user) {
    return await this.meService.me(user);
  }
}
