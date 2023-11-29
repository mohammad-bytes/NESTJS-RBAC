import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/enum/permission.enum';
import { PermissionGuard } from 'src/helper/guard/permission.guard';
import { ModuleName } from 'src/enum/module.enum';
import { PermissionModule } from 'src/helper/decorator/permission.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('permission')
@ApiTags('Permission')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('/create')
  @PermissionModule(ModuleName.PERMISSION, Permission.WRITE)
  async create(@Body() body: CreatePermissionDto) {
    return this.permissionService.createPermission(body);
  }
}
