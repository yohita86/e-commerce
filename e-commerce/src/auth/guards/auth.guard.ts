import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENV } from 'src/config/environment';
import { Observable } from 'rxjs';
import { Role } from '../roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        'No se ha proporcionado un token de autenticación',
      );
    }
    try {
      const secret = ENV.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      payload.exp = new Date(payload.exp * 1000);
      payload.roles = payload.isAdmin ? [Role.Admin] : [Role.User];
      request.user = payload;
      console.log(request.user);

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Error al validar token de autenticación',
      );
    }
  }
}
