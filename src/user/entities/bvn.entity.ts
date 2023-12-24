import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('bvn')
export class BVNEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  bvnNumber: string;

  // Other columns related to BVN...

  @OneToOne(() => UserEntity, (user) => user.bvn) // Establishing one-to-one relationship with UserEntity
  user: UserEntity; // Define the property representing the associated user
}
