import bcrypt from 'bcryptjs';
import { config } from '../../config/environment';

export class HashService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(config.bcrypt.rounds);
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
