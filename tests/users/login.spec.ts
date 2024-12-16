// import request from 'supertest';
// import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
// import { User } from '../../src/entity/User';

describe('POST auth/signup', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // database truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    // destroy database
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it.todo('shloud login user');
  });
});
