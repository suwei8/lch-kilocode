import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { VerificationCode } from './verification-code.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SmsService } from './sms.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VerificationCode]),
    forwardRef(() => AuthModule),
  ], // 注册 User 实体，使其可以在本模块中被注入
  controllers: [UserController],
  providers: [UserService, SmsService],
  exports: [UserService],
})
export class UserModule {}
