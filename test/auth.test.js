const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth Routes', () => {

  beforeAll(async () => {
    await User.deleteOne({ email: 'test@test.com' });
  });

  test('POST /api/auth/register - debe registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Usuario Test',
        email: 'test@test.com',
        password: '123456'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuario registrado correctamente');
  });

  test('POST /api/auth/login - debe iniciar sesión', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - debe fallar con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toBe(400);
  });

});