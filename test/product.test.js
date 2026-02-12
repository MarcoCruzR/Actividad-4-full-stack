const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

let token;

describe('Product Routes', () => {

  beforeAll(async () => {
    await User.deleteOne({ email: 'testproduct@test.com' });

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Usuario Test',
        email: 'testproduct@test.com',
        password: '123456'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testproduct@test.com',
        password: '123456'
      });

    console.log('Login response:', res.body);
    token = res.body.token;
  });

  test('GET /api/products - debe retornar lista de productos', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('authorization', token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/products - debe crear un producto', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('authorization', token)
      .send({
        name: 'Producto Test',
        description: 'Descripción test',
        price: 100,
        category: 'Test',
        stock: 10
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  test('GET /api/products - debe fallar sin token', async () => {
    const res = await request(app)
      .get('/api/products');
    expect(res.statusCode).toBe(401);
  });

});