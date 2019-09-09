const bcrypt = require('bcryptjs');
const {
  User
} = require('../../src/app/models');
const truncate = require('../utils/truncate');
const request = require('supertest');
const factory = require('../factories');
const app = require('../../src/app');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should create user', async () => {
    const {
      name,
      email,
      password
    } = await factory.create('User');
    const response = await request(app)
      .post('/createUser')
      .send({
        name,
        email,
        password
      });

    expect(response.status).toBe(200);
  });

  it('should not create user with missing params', async () => {
    try {
      await request(app)
        .post('/createUser')
        .send({
          name: 'missing'
        });
    } catch (err) {
      expect(err.message).toBe('User not created');
    }
  });

  it('should not create user without password', async () => {
    try {
      await User.create({
        name: 'richard',
        email: 'ric',
        password: undefined
      });
    } catch (err) {
      expect(err.message).toBe('Invalid argument');
    }
  });

  it('should encrypt user password', async () => {
    const user = await User.create({
      name: 'richard',
      email: 'ric',
      password: '123456'
    });

    const comparehash = await bcrypt.compare('123456', user.password_hash);

    expect(comparehash).toBe(true);
  });
});