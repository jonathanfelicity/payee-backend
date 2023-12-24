import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(limit: number, offset: number): Promise<User[]> {
    const users = await this.userRepository.find({
      skip: offset,
      take: limit,
    });
    return users;
  }

  async findById(id: string): Promise<User> {
    const query = `
      SELECT * 
      FROM users 
      WHERE id = ${id}
    `;
    const user = await this.userRepository.query(query, [id]);
    if (!user || user.length === 0) {
      throw new NotFoundException('User not found.');
    }
    return user[0];
  }

  async findByEmail(email: string) {
    const query = `
      SELECT * 
      FROM users 
      WHERE email = ${email}
    `;
    const user = await this.userRepository.query(query, [email]);
    if (!user || user.length === 0) {
      throw new NotFoundException('User not found.');
    }
    return user[0];
  }

  async create(userData: CreateUserDTO): Promise<User> {
    try {
      const newUser = this.userRepository.create(userData);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new ConflictException('User creation failed.');
    }
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User> {
    try {
      const userToUpdate = await this.findById(id);
      // Update the user fields manually
      Object.assign(userToUpdate, userData);
      return await this.userRepository.save(userToUpdate);
    } catch (error) {
      throw new NotFoundException('User update failed.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.findById(id);
      await this.userRepository.remove(user);
    } catch (error) {
      throw new NotFoundException('User removal failed.');
    }
  }
}
