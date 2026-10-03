import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

import { novoAluno } from '../factories/aluno.factory.js';
import { novaDisciplina } from '../factories/disciplina.factory.js';

import { loginAdmin } from '../helpers/admin.helper.js';
import { loginAluno } from '../helpers/aluno.helper.js';

import trabalhos from '../fixtures/trabalhos.json' with { type: 'json' };

describe('Fluxo completo do aluno', () => {
  it('deve cadastrar aluno, cadastrar disciplina, matricular aluno, realizar login e enviar trabalhos', async () => {
    // Login do administrador
    const adminToken = await loginAdmin();

    for (const trabalho of trabalhos) {
      // Dados gerados pelas factories
      const aluno = novoAluno();
      const disciplina = novaDisciplina();

      // 1. Cadastro do aluno
      const respostaAluno = await request(app)
        .post('/api/admin/alunos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(aluno);

      expect(respostaAluno.status).to.equal(201);
      expect(respostaAluno.body).to.have.property('id');
      expect(respostaAluno.body.nome).to.equal(aluno.nome);
      expect(respostaAluno.body.email).to.equal(aluno.email);
      expect(respostaAluno.body.matricula).to.equal(aluno.matricula);

      const alunoId = respostaAluno.body.id;

      // 2. Cadastro da disciplina
      const respostaDisciplina = await request(app)
        .post('/api/admin/disciplinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(disciplina);

      expect(respostaDisciplina.status).to.equal(201);
      expect(respostaDisciplina.body).to.have.property('id');
      expect(respostaDisciplina.body.nome).to.equal(disciplina.nome);
      expect(respostaDisciplina.body.codigo).to.equal(disciplina.codigo);
      expect(respostaDisciplina.body.cargaHoraria).to.equal(
        disciplina.cargaHoraria
      );

      const disciplinaId = respostaDisciplina.body.id;

      // 3. Matrícula do aluno na disciplina
      const respostaMatricula = await request(app)
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          alunoId
        });

      expect(respostaMatricula.status).to.equal(201);
      expect(respostaMatricula.body).to.have.property('alunoId', alunoId);
      expect(respostaMatricula.body).to.have.property(
        'disciplinaId',
        disciplinaId
      );

      // 4. Login do aluno
      const alunoLogado = await loginAluno(
        aluno.email,
        aluno.senha
      );

      expect(alunoLogado.alunoId).to.equal(alunoId);

      // 5. Envio do trabalho
      const respostaTrabalho = await request(app)
        .post(`/api/alunos/${alunoLogado.alunoId}/trabalhos`)
        .set('Authorization', `Bearer ${alunoLogado.token}`)
        .send({
          disciplinaId,
          titulo: trabalho.titulo,
          descricao: trabalho.descricao
        });

      expect(respostaTrabalho.status).to.equal(201);
      expect(respostaTrabalho.body).to.have.property('id');
      expect(respostaTrabalho.body.alunoId).to.equal(alunoId);
      expect(respostaTrabalho.body.disciplinaId).to.equal(disciplinaId);
      expect(respostaTrabalho.body.titulo).to.equal(trabalho.titulo);
      expect(respostaTrabalho.body.descricao).to.equal(trabalho.descricao);
      expect(respostaTrabalho.body.status).to.equal(
        trabalho.statusDeEntrega.toLowerCase()
      );
    }
  });
});