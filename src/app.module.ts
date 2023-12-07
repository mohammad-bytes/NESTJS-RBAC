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
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PaymentModule } from './api/payment/payment.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 3,
      },
    ]),
    AdminModule,
    ModuleModule,
    PermissionModule,
    RoleModule,
    AuthModule,
    MeModule,
    DashboardModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
