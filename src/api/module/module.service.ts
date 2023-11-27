import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Modules } from './entities/module.entity';
import { Repository } from 'typeorm';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { message } from 'src/constant/message';
import { CreateModuleDto } from './dto/create-module';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Modules)
    private readonly moduleRepository: Repository<Modules>,
  ) {}

  async createModule(body: CreateModuleDto): Promise<BaseResponseDto> {
    try {
      const isExist = await this.moduleRepository.count({
        where: { name: body.name.toLocaleLowerCase() },
      });
      if (isExist != 0) {
        throw new HttpException(message.MODULE_EXISTS, HttpStatus.BAD_REQUEST);
      }

      const module = new Modules();
      module.name = body.name.toLocaleLowerCase();
      module.description = body.description;

      const data = await this.moduleRepository.save(module);
      return {
        statusCode: HttpStatus.CREATED,
        message: message.MODULE_CREATED,
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
