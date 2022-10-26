import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {
  let token: any;
  let usuariId: any;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'db_blogpessoal_test',
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          dropSchema: true
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();});

  it('01 - Deve Cadastrar Usuario', async()=>{
    const resposta = await request(app.getHttpServer()).post('/Usuario/Cadastrar').send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: '' });
    expect(201)

    usuariId = resposta.body.id;});

  it('02 - Deve Autenticar Usuário (Login)', async () => {
    const resposta = await request(app.getHttpServer())
    . post('/auth/logar')
    . send ({
      usuario: 'root@root.com',
      senha: 'rootroot'});
  expect(200)});

  it ('03 - Não Deve Duplicar o Usuario', async()=>{
    request (app.getHttpServer()).post('/usuario/cadastrar').send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: '' });
    expect(400);});

it('04 - Deve Listar todos os Usuários', async () => {
  request(app.getHttpServer())
  .get('/usuarios/all')
  .set('Authorization', `${token}`)
  .send({})
  expect(200)});

it('05 - Deve Atualizar um Usuário', async () => {
  request(app.getHttpServer())
  .put('/usuarios/atualizar')
  .set('Authorization', `${token}`)
  .send({
    id: usuariId,
    nome: 'Root Atualizado',
    usuario: 'root@root',
    senha: 'rootroot',
    foto: ''})
  .then(resposta =>{
  expect('Root Atuakizado').toEqual(resposta.body.name)})
  expect(200)});
});