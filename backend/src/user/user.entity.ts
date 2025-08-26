import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // 指定数据库中的表名为 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 11 })
  phone: string;

  // 密码在存入数据库前必须进行哈希加密
  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' }) // 自动设置创建时间
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // 自动设置更新时间
  updatedAt: Date;
}
