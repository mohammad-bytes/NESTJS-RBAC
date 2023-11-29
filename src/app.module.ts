import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/mysql.config';
import { AdminModule } from './api/admin/admin.module';
import { ModuleModule } from './api/module/module.module';
import { PermissionModule } from './api/permission/permission.module';
import { RoleModule } from './api/role/role.module';
import { AuthModule } from './api/auth/auth.module';
import { MeModule } from './api/me/me.module';
import { DashboardModule } from './api/dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AdminModule,
    ModuleModule,
    PermissionModule,
    RoleModule,
    AuthModule,
    MeModule,
    DashboardModule,
  ],
})
export class AppModule {}
