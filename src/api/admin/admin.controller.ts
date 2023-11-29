import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { PermissionGuard } from 'src/helper/guard/permission.guard';
import { AuthGuard } from '@nestjs/passport';
import { PermissionModule } from 'src/helper/decorator/permission.decorator';
import { ModuleName } from 'src/enum/module.enum';
import { Permission } from 'src/enum/permission.enum';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/create-user')
  @PermissionModule(ModuleName.ADMIN, Permission.WRITE)
  async create(@Body() body: CreateUserDto): Promise<BaseResponseDto> {
    return this.adminService.createUser(body);
  }
}
