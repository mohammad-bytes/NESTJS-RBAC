import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { BaseResponseDto } from 'src/helper/base-response.dto';
import { message } from 'src/constant/message';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { RolePermissionDto } from './dto/role-permission.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}
  async createRole(body: CreateRoleDto): Promise<BaseResponseDto> {
    try {
      const isExists = await this.roleRepository.count({
        where: { name: body.name.toLocaleLowerCase() },
      });
      if (isExists != 0) {
        throw new HttpException(message.ROLE_EXISTS, HttpStatus.BAD_REQUEST);
      }
      const role = new Role();
      role.name = body.name.toLocaleLowerCase();
      role.description = body.description;
      const data = await this.roleRepository.save(role);

      return {
        statusCode: HttpStatus.CREATED,
        message: message.ROLE_CREATED,
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRolePermission(
    body: RolePermissionDto,
  ): Promise<BaseResponseDto> {
    try {
      const { role, module, permission } = body;
      // const isExists = await this.roleRepository.findOne({
      //   where: { id: role_id },
      // });
      // if (!isExists) {
      //   throw new HttpException(message.ROLE_NOT_FOUND, HttpStatus.BAD_REQUEST);
      // }

      const data = await this.rolePermissionRepository.save({
        role: { id: role },
        module: { id: module },
        permission: { id: permission },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: message.ROLE_PERMISSION_CREATED,
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
