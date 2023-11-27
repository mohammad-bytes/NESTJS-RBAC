import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modules } from './entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Modules])],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
