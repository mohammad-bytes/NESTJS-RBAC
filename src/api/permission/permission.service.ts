import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { message } from 'src/constant/message';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async createPermission(body: CreatePermissionDto): Promise<BaseResponseDto> {
    try {
      const isExist = await this.permissionRepository.count({
        where: {
          name: body.name.toLocaleLowerCase(),
          // module: { id: body.module },
        },
      });
      if (isExist != 0) {
        throw new HttpException(
          message.PERMISSION_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await this.permissionRepository.save({
        name: body.name.toLocaleLowerCase(),
        // module: { id: body.module },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: message.PERMISSION_CREATED,
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
