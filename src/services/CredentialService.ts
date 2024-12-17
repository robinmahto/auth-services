import bcrypt from 'bcrypt';

export class CredentialService {
  async comparePassword(userPassword: string, passwordHash: string) {
    // compare password logic
    return await bcrypt.compare(userPassword, passwordHash);
  }
}
