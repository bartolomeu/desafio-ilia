import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    // JwtModule.register({
    //   global: true,
    //   secret: JWT_SECRET,
    //   signOptions: {
    //     expiresIn: JWT_EXPIRES_IN,
    //   },
    // }),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
