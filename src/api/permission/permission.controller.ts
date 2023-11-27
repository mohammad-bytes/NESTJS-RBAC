import { Controller, Post, Body } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('permission')
@ApiTags('Permission')
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('/create')
  async create(@Body() body: CreatePermissionDto) {
    return this.permissionService.createPermission(body);
  }
}
