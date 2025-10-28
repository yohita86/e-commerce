import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const hasRole = () =>
      requiredRoles.some((role) => request.user?.roles?.includes(role));
    const valid = request.user && request.user.roles && hasRole();

    if (!valid) {
      throw new ForbiddenException(
        'No tiene permisos suficientes para acceder a esta ruta',
      );
    }

    return true;
  }
}
