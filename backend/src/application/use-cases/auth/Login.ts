import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthResponseDto } from '../../dtos/AuthResponseDto';
import { LoginDto } from '../../dtos/LoginDto';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError';

export class Login {
  constructor(
    private userRepository: IUserRepository,
    private comparePassword: (
      password: string,
      hash: string
    ) => Promise<boolean>,
    private generateToken: (userId: string, role: string) => string
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account is disabled');
    }

    const isPassWordValid = await this.comparePassword(
      dto.password,
      user.password
    );
    if (!isPassWordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = this.generateToken(user.id!, user.role);

    return {
      user: {
        id: user.id!,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
    };
  }
}
