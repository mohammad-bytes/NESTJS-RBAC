import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../admin/entites/user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { message } from 'src/constant/message';
import { Modules } from '../module/entities/module.entity';
import { RolePermission } from '../role/entities/role-permission.entity';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class MeService {
	constructor(
		@InjectRepository(User)
		private userRepository:Repository<User>,
		@InjectRepository(Role)
		private roleRepository:Repository<Role>,
	){}
	async me(user){

		const data = await this.userRepository
    .createQueryBuilder('u')
    .select([
        'u.id as user_id',
        'u.first_name as first_name',
        'u.last_name as last_name',
        'u.phone as phone',
        'u.email as email',
        'r.id as role_id',
        'r.name as role_name',
        `JSON_ARRAYAGG(
            JSON_OBJECT(
                'module', m.name,
                'permissions', JSON_ARRAY(p.name)
            )
        ) as module_permission`,
    ])
    .leftJoin(Role, 'r', 'r.id = u.role_id')
    .leftJoin(RolePermission, 'rp', 'rp.role_id = r.id')
    .leftJoin(Modules, 'm', 'm.id = rp.module_id')
    .leftJoin(Permission, 'p', 'p.id = rp.permission_id')
    .where(`u.email = '${user.email}'`)
    .groupBy('u.id, u.first_name, u.last_name, u.email, u.phone, r.id, r.name')
    .getRawMany();


		// const data=await this.userRepository
		// .createQueryBuilder('u')
		// .select([
		// 	'u.id as user_id',
		// 	'u.first_name as first_name',
		// 	'u.last_name as last_name',
		// 	'u.phone as phone',
		// 	'u.email as email',
		// 	'r.id as role_id',
		// 	'r.name as role_name',
		// 	// 'JSON_ARRAYAGG(m.name) as module_name',
		// 	// 'm.name as module_name',
		// 	// 'JSON_ARRAYAGG(p.name) as permission_name'
		// 	`JSON_ARRAYAGG(
		// 		JSON_OBJECT(
		// 			'module',m.name,
		// 			'permission',JSON_ARRAYAGG(p.name)
		// 		)
		// 	) as module_permission`,

		// ])
		// .leftJoin(Role,'r','r.id = u.role_id')
		// .leftJoin(RolePermission,'rp','rp.role_id = r.id')
		// .leftJoin(Modules,'m','m.id = rp.module_id')
		// .leftJoin(Permission,'p','p.id = rp.permission_id')
		// .where(`u.email = '${user.email}'`)
		// .groupBy('u.id,u.first_name,u.last_name,u.email,u.phone,r.id,r.name')
		// .getRawMany();

		return {
			statusCode:HttpStatus.ACCEPTED,
			message:message.SUCCESS,
			data
		};
	}
}
