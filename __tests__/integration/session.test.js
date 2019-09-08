const request = require('supertest');
const app = require('../../src/app');
const factory = require('../factories');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should receive JWT token when authenticated with valid credentials', async () => {
        const user = await factory.create('User', {
            password: 's123'
        });
        
        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: 's123'
            });

        expect(response.status).toBe(200);
    });

    it('should not authenticate with invalid user', async () => {
        await await factory.create('User');

        const response = await request(app)
            .post('/sessions')
            .send({
                email: 'invalid@123',
                password: '1231232'
            });

        expect(response.status).toBe(401);
    });

    it('should not authenticate with incorrect credentials', async () => {
        const user = await await factory.create('User');

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '1231232'
            });

        expect(response.status).toBe(401);
    });

    it('Should return JWT token when authenticated', async () => {
        const user = await factory.create('User', {
            password: '123123'
        }); 

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '123123'
            });

        expect(response.body).toHaveProperty('token');
    });

    it('Should be able to access private routes when authenticated', async () => {
        const user = await factory.create('User', {
            password: '123123'
        }); 

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${user.genareteToken()}`);

        expect(response.status).toBe(200);
    });

    it('Should not be able to access private routes without JWT token', async () => {
        const response = await request(app)
            .get('/dashboard');

        expect(response.status).toBe(401);
    });

    it('Should not be able to access private with invalid JWT token', async () => {
        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', 'Bearer 123456');

        expect(response.status).toBe(401);
    });
});