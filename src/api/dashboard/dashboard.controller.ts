import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/helper/guard/permission.guard';
import { Permission } from 'src/enum/permission.enum';
import { ModuleName } from 'src/enum/module.enum';
import { PermissionModule } from 'src/helper/decorator/permission.decorator';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/get-user')
  @PermissionModule(ModuleName.DASHBOARD, Permission.READ)
  async user() {
    return await this.dashboardService.getAllUser();
  }

  @Post('/new')
  @PermissionModule(ModuleName.DASHBOARD, Permission.WRITE)
  async post() {
    return 'post';
  }

  @Put('/put')
  @PermissionModule(ModuleName.DASHBOARD, Permission.UPDATE)
  async put() {
    return 'put';
  }

  @Delete('/delete')
  @PermissionModule(ModuleName.DASHBOARD, Permission.DELETE)
  async delete() {
    return 'delete';
  }
}
