import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../admin/entites/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { message } from 'src/constant/message';
import { Modules } from '../module/entities/module.entity';
import { RolePermission } from '../role/entities/role-permission.entity';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class MeService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}
  async me(user) {
    const data = await this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id as user_id',
        'u.first_name as first_name',
        'u.last_name as last_name',
        'u.phone as phone',
        'u.email as email',
        'u.role_id as role_id',
        'r.name as role_name',
      ])
      .leftJoin(Role, 'r', 'r.id = u.role_id')
      .where(`u.email = '${user.email}'`)
      .getRawOne();

    const permissionQuery = await this.rolePermissionRepository
      .createQueryBuilder('rp')
      .select(['m.name as module_name', 'p.name as permission_name'])
      .leftJoin(Modules, 'm', 'm.id = rp.module_id')
      .leftJoin(Permission, 'p', 'p.id = rp.permission_id')
      .where(`rp.role_id = ${data.role_id}`)
      .getRawMany();

    const permission_data = permissionQuery.reduce((result, ele) => {
      const exitsModule = result.find(
        (val) => val.module_name === ele.module_name,
      );
      if (!exitsModule) {
        result.push({
          module_name: ele.module_name,
          permission_name: ele.permission_name.split(' '),
        });
      } else {
        exitsModule.permission_name = [
          exitsModule.permission_name,
          ele.permission_name,
        ].flat(Infinity);
      }
      return result;
    }, []);

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: message.SUCCESS,
      data: {
        ...data,
        module_permission: permission_data,
      },
    };
  }
}
