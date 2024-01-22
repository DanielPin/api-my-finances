import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
const configService = new ConfigService();

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        privateKey: configService
          .get<string>('PRIVATE_KEY')
          .split(String.raw`\n`)
          .join('\n'),
        publicKey: configService
          .get<string>('PUBLIC_KEY')
          .split(String.raw`\n`)
          .join('\n'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: '1d',
        },
      }),
    }),
  ],
})
export class AuthModule {}
