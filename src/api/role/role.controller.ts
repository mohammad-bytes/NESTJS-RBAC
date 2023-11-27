import { Controller, Post, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { RolePermissionDto } from './dto/role-permission.dto';

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  async create(@Body() body: CreateRoleDto): Promise<BaseResponseDto> {
    return this.roleService.createRole(body);
  }

  @Post('/create-role-permission')
  async rolePermission(
    @Body() body: RolePermissionDto,
  ): Promise<BaseResponseDto> {
    return this.roleService.createRolePermission(body);
  }
}
