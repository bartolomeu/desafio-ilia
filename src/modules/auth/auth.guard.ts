import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userIdHeader = req.headers['profile'];;
    if (!userIdHeader) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
