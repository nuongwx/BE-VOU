import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/user.model';
import { RegisterInput, LoginInput } from './auth.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('data') data: RegisterInput){
    return this.authService.register(data);
  }

  @Mutation(() => String)
  async login(@Args('data') data: LoginInput): Promise<string> {
    return this.authService.login(data.userName, data.password);
  }
}
