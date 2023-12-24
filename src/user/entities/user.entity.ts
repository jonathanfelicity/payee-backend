import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BVNEntity } from './bvn.entity';
import bcrypt from 'bcryptjs';

enum UserGender {
  Male = 'Male',
  Female = 'Female',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  photoUrl: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  middleName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  @Column({ nullable: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  @OneToOne(() => BVNEntity, (bvn) => bvn.user)
  @JoinColumn()
  bvn: BVNEntity;

  @CreateDateColumn({ name: 'created_at' }) // Column for storing creation timestamp
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // Column for storing update timestamp
  updatedAt: Date;
}
