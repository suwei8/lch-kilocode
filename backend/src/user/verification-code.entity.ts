import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('verification_codes')
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 11 })
  phone: string;

  @Column()
  code: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}