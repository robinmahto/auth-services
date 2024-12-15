import { sign, JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import createHttpError from 'http-errors';
import { Config } from '../config';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';
import { Repository } from 'typeorm';

export class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
  generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.join(__dirname, '../../certs/private.pem'),
      );
    } catch (error) {
      const err = createHttpError(500, 'Error while reading Private key');
      throw err;
    }
    const accessToken = sign(payload, privateKey, {
      expiresIn: '1h',
      algorithm: 'RS256',
      issuer: 'auth-service',
    });
    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, String(Config.REFRESH_TOKEN_SECRET), {
      expiresIn: '1y',
      algorithm: 'HS256',
      issuer: 'auth-service',
      jwtid: String(payload.id),
    });
    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    // persist refresh token in database
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1Y -> (leap year)

    const newRefreshToken = await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshToken;
  }
}
