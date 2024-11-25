import request from 'supertest';
import app from '../../src/app';

describe('POST auth/signup', () => {
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

      //  Assert
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

      //  Assert
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
      const response = await request(app)
        .post('/auth/signup')
        .send(userPayload);

      // Assert
    });
  });
});
