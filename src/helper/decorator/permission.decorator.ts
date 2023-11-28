import { SetMetadata } from '@nestjs/common';

export const PermissionModule = (...permissions: string[]) =>
  SetMetadata('permission', permissions);
