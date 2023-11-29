import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { RolePermissionDto } from './dto/role-permission.dto';
import { ModuleName } from 'src/enum/module.enum';
import { PermissionModule } from 'src/helper/decorator/permission.decorator';
import { Permission } from 'src/enum/permission.enum';
import { PermissionGuard } from 'src/helper/guard/permission.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  @PermissionModule(ModuleName.ROLE, Permission.WRITE)
  async create(@Body() body: CreateRoleDto): Promise<BaseResponseDto> {
    return this.roleService.createRole(body);
  }

  @Post('/create-role-permission')
  @PermissionModule(ModuleName.ROLE_PERMISSION, Permission.WRITE)
  async rolePermission(
    @Body() body: RolePermissionDto,
  ): Promise<BaseResponseDto> {
    return this.roleService.createRolePermission(body);
  }
}
