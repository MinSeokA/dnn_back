import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  // 필수 옵션
  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  // 선택 옵션
  @Column({ default: false })
  isAdmin: boolean;
}


