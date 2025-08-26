import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsPhoneNumber('CN', { message: '请输入有效的中国大陆手机号' })
  phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;
}
