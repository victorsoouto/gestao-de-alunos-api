import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';

describe('Login', () => {
    let token;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    });

    it('deve cadastrar um aluno quando ele informar dados válidos', async () => {
        //Cadastrar Aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Victor Souto',
                email: 'victorsoouto@gmail.com',
                matricula: '2026-0001',
                senha: '123456'
            });

        //Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Victor Souto');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-0001');
        expect(cadastroAlunoResposta.body.email).to.equal('victorsoouto@gmail.com');
    })

    it.only('deve negar o cadastro de um aluno quando ele já existe', async () => {
        //Cadastrar Aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Ana Souza', 
                email: 'ana.souza@example.com', 
                matricula: '2024001',
                senha: '123456'
            });

        //Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
    })
});