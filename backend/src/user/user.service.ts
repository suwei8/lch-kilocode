import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtService } from '@nestjs/jwt';
import { SmsService } from './sms.service';
import { VerificationCode } from './verification-code.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * 用户注册
   * @param authUserDto
   */
  async register(authUserDto: AuthUserDto): Promise<Omit<User, 'password'>> {
    const { phone, password } = authUserDto;

    // 1. 检查手机号是否已被注册
    const existingUser = await this.userRepository.findOne({
      where: { phone },
    });
    if (existingUser) {
      throw new ConflictException('该手机号已被注册');
    }

    // 2. 对密码进行哈希加密
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. 创建新用户实例并保存到数据库
    const newUser = this.userRepository.create({
      phone,
      password: hashedPassword,
      salt,
      nickname: `用户${phone.slice(-4)}`,
    });
    await this.userRepository.save(newUser);

    // 4. 从返回结果中剔除密码字段
    const { password: _, ...result } = newUser;
    return result;
  }

  /**
   * 用户登录
   * @param authUserDto
   */
  async login(authUserDto: AuthUserDto): Promise<{ accessToken: string }> {
    const { phone, password } = authUserDto;

    // 1. 根据手机号查找用户
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    // 2. 对比用户提交的密码和数据库中存储的哈希密码是否匹配
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    // 3. 生成 JWT Token
    const payload = { phone: user.phone, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * 根据 ID 查找用户
   * @param id
   */
  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async sendVerificationCode(phone: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCode = this.verificationCodeRepository.create({
      phone,
      code,
    });
    await this.verificationCodeRepository.save(verificationCode);
    await this.smsService.sendVerificationCode(phone, code);
  }

  async loginWithCode(
    phone: string,
    code: string,
  ): Promise<{ accessToken: string }> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { phone, code },
      order: { createdAt: 'DESC' },
    });

    if (!verificationCode) {
      throw new UnauthorizedException('验证码错误');
    }

    const now = new Date();
    const createdAt = verificationCode.createdAt;
    const diff = now.getTime() - createdAt.getTime();

    if (diff > 5 * 60 * 1000) {
      throw new UnauthorizedException('验证码已过期');
    }

    let user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(phone, salt); // Use phone as a temporary password
      user = this.userRepository.create({
        phone,
        password: hashedPassword,
        salt,
        nickname: `用户${phone.slice(-4)}`,
      });
      await this.userRepository.save(user);
    }

    const payload = { phone: user.phone, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
