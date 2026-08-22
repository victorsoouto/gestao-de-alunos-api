import request from 'supertest';
import { expect } from 'chai';

describe('Login', () => {
    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin123' 
            });

        expect(loginResposta.status).to.equal(200);
    })

    it('deve retornar 400 quando a requisição for passada errada', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: '' 
            });

        expect(loginResposta.status).to.equal(400);
    })

    it('deve retornar 401 quando o usuário ou senha forem incorretos', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin1234' 
            });

        expect(loginResposta.status).to.equal(401);
    })
})