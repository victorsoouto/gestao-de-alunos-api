import { api } from '../helpers/api.js'
import { expect } from 'chai';
import 'dotenv/config'
import { comTokenDeAdmin } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';

describe('Matricula de Aluno em Disciplina', () => {
    it('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {

        //Cadastrar Aluno
        const cadastroAlunoResposta = await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', await comTokenDeAdmin())
        .send(novoAluno());

        const alunoId = cadastroAlunoResposta.body.id;
        
        const cadastroDisciplinaResposta = await api()
        .post('/api/admin/disciplinas')
        .set('Content-Type', 'application/json')
        .set('Authorization', await comTokenDeAdmin())
        .send(novaDisciplina());

        const disciplinaId = cadastroDisciplinaResposta.body.id

        const matricula = await await api()
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Content-Type', 'application/json')
        .set('Authorization', await comTokenDeAdmin())
        .send({
            alunoId: alunoId
        });

        expect(matricula.status).to.equal(201);
        expect(matricula.body.alunoId).to.equal(alunoId);
        expect(matricula.body.disciplinaId).to.equal(disciplinaId);
    })
})