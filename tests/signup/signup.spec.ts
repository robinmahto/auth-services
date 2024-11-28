import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from '../utils';
import { User } from '../../src/entity/User';

describe('POST auth/signup', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // database truncate
    await truncateTables(connection);
  });

  afterAll(async () => {
    // destroy database
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return 201 status code', async () => {
      // Arrange
      const userPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      // Act
      const response = await request(app)
        .post('/auth/signup')
        .send(userPayload);

      // Assert
      expect(response.status).toBe(201);
    });

    it('should return valid json', async () => {
      // Arrange
      const userPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      // Act
      const response = await request(app)
        .post('/auth/signup')
        .send(userPayload);

      // Assert
      expect(
        (response.headers as Record<string, string>)['content-type'],
      ).toEqual(expect.stringContaining('json'));
    });

    it('should persist the user in the database', async () => {
      // Arrange
      const userPayload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      // Act
      await request(app).post('/auth/signup').send(userPayload);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
    });
  });
});
