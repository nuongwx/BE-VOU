import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // To receive messages from other BE repositories, they need to verify the user token
  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
