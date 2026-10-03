import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

export async function loginAdmin() {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email: process.env.ADMIN_EMAIL,
      senha: process.env.ADMIN_SENHA
    });

  expect(resposta.status).to.equal(200);
  expect(resposta.body).to.have.property('token');
  expect(resposta.body.usuario.role).to.equal('admin');

  return resposta.body.token;
}