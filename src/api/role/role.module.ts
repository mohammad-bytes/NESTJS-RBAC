import { Module, OnModuleInit } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule implements OnModuleInit {
  constructor(private roleService: RoleService) {}
  async onModuleInit() {
    await this.roleService.createAdminRole(
      'SUPER ADMIN',
      'super admin can access all modules',
    );
  }
}
