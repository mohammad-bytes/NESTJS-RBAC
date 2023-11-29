import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MeService } from 'src/api/me/me.service';
import { Permission } from 'src/enum/permission.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private meServices: MeService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Permission[]>(
      'permission',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const { data } = await this.meServices.me(user);

    // super admin can access all modules
    if (data.role_name == 'super admin') {
      return true;
    }

    // checking user has module permission to read or write
    const module = data?.module_permission?.find(
      (val) => val.module == requiredRoles[0],
    );
    return module?.permission?.some((ele) => ele == requiredRoles[1]);
  }
}
