import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './configs/postgres.config.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { CardModule } from './modules/card/card.module';

const configService = new ConfigService();
@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
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
      global: true,
    }),
    HealthModule,
    CardModule,
  ],
})
export class AppModule {}
