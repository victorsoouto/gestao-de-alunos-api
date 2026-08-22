import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import * as sinon from 'sinon';
import authService from '../../src/services/auth.service.js';

describe('Login', () => {
    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin123' 
            });

        expect(loginResposta.status).to.equal(200);
    })

    it('deve retornar 400 quando a requisição for passada errada', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: '' 
            });

        expect(loginResposta.status).to.equal(400);
    })

    it('deve retornar 401 quando o usuário ou senha forem incorretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin1234' 
            });

        expect(loginResposta.status).to.equal(401);
    })

    it('deve retornar 500 quando acontecer algum problema de onexão com o banco de dados', async () => {
        const authServiceMock = sinon.stub(authService, 'login');
        authServiceMock.throws(new Error('ERRO CATASTRÓFICO!!!!!!'))

        const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: 'admin@escola.com', 
            senha: 'admin123' 
        });

        expect(loginResposta.status).to.equal(500);

        sinon.restore();
    })
})