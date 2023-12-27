import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find all users with pagination.
   * @param limit - The maximum number of users to retrieve.
   * @param offset - The number of users to skip.
   * @returns A Promise that resolves to an array of User entities.
   */
  async findAll(limit: number, offset: number): Promise<User[]> {
    const users = await this.userRepository.find({
      skip: offset,
      take: limit,
    });
    return users;
  }

  /**
   * Find a user by their ID.
   * @param id - The ID of the user to find.
   * @returns A Promise that resolves to the found User entity.
   * @throws NotFoundException if the user with the given ID is not found.
   */
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find a user by their email.
   * @param email - The email of the user to find.
   * @returns A Promise that resolves to the found User entity.
   * @throws NotFoundException if the user with the given email is not found.
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Create a new user.
   * @param userData - The data of the user to create.
   * @returns A Promise that resolves to the created User entity.
   * @throws ConflictException if there's an error saving the user.
   */
  async create(userData: any): Promise<any> {
    // Destructure password from userData and hash it separately
    const { password, ...restData } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with hashed password
    const newUser = this.userRepository.create({
      ...restData,
      password: hashedPassword,
    });

    try {
      // Save the new user to the database
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new ConflictException('Error saving user');
    }

    return newUser;
  }
}
