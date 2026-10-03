import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

export async function loginAluno(email, senha) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email,
      senha
    });

  expect(resposta.status).to.equal(200);
  expect(resposta.body).to.have.property('token');
  expect(resposta.body.usuario.role).to.equal('aluno');

  return {
    token: resposta.body.token,
    alunoId: resposta.body.usuario.id
  };
}