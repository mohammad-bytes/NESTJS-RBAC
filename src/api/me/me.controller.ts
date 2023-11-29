import { Controller, Get, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/helper/decorator/user.decorator';
import { PermissionGuard } from 'src/helper/guard/permission.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('me')
@ApiTags('me')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('/')
  // @PermissionModule(ModuleName.ME, Permission.READ)
  async me(@GetUser() user) {
    return await this.meService.me(user);
  }
}
