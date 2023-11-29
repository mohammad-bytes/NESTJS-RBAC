import { Global, Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../admin/entites/user.entity';
import { RolePermission } from '../role/entities/role-permission.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, RolePermission])],
  controllers: [MeController],
  providers: [MeService],
  exports: [MeService],
})
export class MeModule {}
