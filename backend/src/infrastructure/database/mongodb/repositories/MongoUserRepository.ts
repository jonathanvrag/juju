import { User } from '../../../../domain/entities/User';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { UserModel } from '../models/UserModel';

export class MongoUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);
    return this.toEntity(createdUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user ? this.toEntity(user) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: user },
      { new: true }
    );
    return updatedUser ? this.toEntity(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  private toEntity(userDoc: any): User {
    return {
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      name: userDoc.name,
      role: userDoc.role,
      isActive: userDoc.isActive,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }
}
