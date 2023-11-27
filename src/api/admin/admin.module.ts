import { Module, OnModuleInit } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/helper/email-helper.service';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [AdminController],
  providers: [AdminService, JwtService, EmailService],
})
export class AdminModule implements OnModuleInit {
  constructor(private adminService: AdminService) {}
  async onModuleInit() {
    await this.adminService.generateAdminCredential();
  }
}
