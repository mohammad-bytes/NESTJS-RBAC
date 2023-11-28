import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../admin/entites/user.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Role])],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
