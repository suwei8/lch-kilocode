import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { VerificationCode } from './user/verification-code.entity';

@Module({
  imports: [
    // 1. 加载 .env 文件中的环境变量
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局模块，这样其他模块就不需要再单独导入 ConfigModule
      envFilePath: '.env', // 指定 .env 文件的路径
    }),

    // 2. 异步配置 TypeOrmModule
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 导入 ConfigModule
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')!),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, VerificationCode],
        synchronize: true,
      }),
    }),

    // 3. 异步配置 RedisModule
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(configService.get<string>('REDIS_PORT')!),
        },
      }),
    }),

    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
