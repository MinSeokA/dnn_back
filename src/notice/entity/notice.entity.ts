import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("notice")
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;
  
  @Column({
    nullable: false
  })
  title: string;

  @Column({
    nullable: false
  })
  content: string;

  @Column({
    nullable: true
  })
  image: string;

  @Column({
    nullable: true
  })
  file: string;
  
  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: new Date() })
  updated_at: Date;
}