import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// enum Gender {
//   Male = 'Male',
//   Female = 'Female',
// }

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  middleName: string;

  // @Column({ nullable: true, enum: Gender, default: Gender.Male })
  // gender: Gender;
}
