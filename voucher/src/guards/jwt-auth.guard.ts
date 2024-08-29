import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authHeader = ctx.req.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    try {
      const { valid, user } = await this.authService.validateToken(token);
      if (valid) {
        ctx.req.user = user;

        console.log('User is valid');

        return true;
      }

      console.error('Invalid token');
      return false;
    } catch (e) {
      console.error('Invalid token');
      return false;
    }
  }
}
