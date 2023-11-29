import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateModuleDto } from './dto/create-module';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/helper/guard/permission.guard';
import { PermissionModule } from 'src/helper/decorator/permission.decorator';
import { ModuleName } from 'src/enum/module.enum';
import { Permission } from 'src/enum/permission.enum';

@Controller('module')
@ApiTags('Module')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post('/create')
  @PermissionModule(ModuleName.MODULE, Permission.WRITE)
  async create(@Body() body: CreateModuleDto): Promise<BaseResponseDto> {
    return await this.moduleService.createModule(body);
  }
}
