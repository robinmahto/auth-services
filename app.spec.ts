import sum from './src/unit';
import request from 'supertest';
import app from './src/app';

describe('should work', () => {
  it('should return 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  it('should return 200 status code', async () => {
    const response = await request(app).get('/').send();
    expect(response.statusCode).toBe(200);
  });
});
