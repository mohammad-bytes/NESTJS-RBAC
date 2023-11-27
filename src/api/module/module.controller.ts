import { Body, Controller, Post } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateModuleDto } from './dto/create-module';
import { BaseResponseDto } from 'src/helper/base-response.dto';

@Controller('module')
@ApiTags('Module')
@ApiBearerAuth()
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post('/create')
  async create(@Body() body: CreateModuleDto): Promise<BaseResponseDto> {
    return await this.moduleService.createModule(body);
  }
}
