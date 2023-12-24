import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum UserGender {
  Male = 'male',
  Female = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: 'CHAMS-WALLET' })
  walletName: string;

  @Column({ nullable: true, default: '9a37852b-5c7f-4d2-8b12-2d67b77fe64e' })
  walletReference: string;

  @Column({ nullable: true })
  walletId: string;

  @Column({
    nullable: true,
    default: 'https://example.com/john-doe-avatar.jpg',
  })
  photoUrl: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  middleName: string;

  @Column({ nullable: false, unique: true })
  customerEmail: string;

  @Column({
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column('simple-json', { nullable: true })
  bvnDetails: object;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
