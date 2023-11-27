import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/helper/base-response.dto';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/create-user')
  async create(@Body() body: CreateUserDto): Promise<BaseResponseDto> {
    return this.adminService.createUser(body);
  }
}
