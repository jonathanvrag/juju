import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { RegisterUserDto } from '../../dto/RegisterUserDto';
import { ValidationError } from '../../../shared/errors/ValidationError';

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private hashPassword: (password: string) => Promise<string>
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ValidationError('Email already registered.');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user: User = {
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: dto.role || 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.userRepository.create(user);
  }
}
