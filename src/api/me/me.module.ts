import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../admin/entites/user.entity';
import { RolePermission } from '../role/entities/role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RolePermission])],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
