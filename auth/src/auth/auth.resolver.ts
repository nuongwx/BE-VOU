import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignUpInput } from './dto/signUp-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignResponse } from 'src/auth/dto/sign-response';
import { SignInInput } from 'src/auth/dto/signIn-input';
import { LogoutResponse } from 'src/auth/dto/logout-response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    const { otpSession } = await this.authService.signUp(signUpInput);
    return otpSession;
  }

  @Mutation(() => String)
  async verifyOtp(
    @Args('phoneNumber') phoneNumber: string,
    @Args('otpSession') otpSession: string,
  ) {
    return this.authService.verifyOtp(phoneNumber, otpSession);
  }

  @Mutation(() => SignResponse)
  signIn(@Args('SignInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }

  @Mutation(() => LogoutResponse)
  logOut(@Args('id', { type: () => Int }) id: number) {
    return this.authService.logOut(id);
  }

  @Query(() => String)
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Context() context) {
    return 'Redirecting to Facebook...';
  }

  @Query(() => String)
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Context() context) {
    return this.authService.facebookLogin(context);
  }
}
