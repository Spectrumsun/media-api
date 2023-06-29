import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);

    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto = {
      email: 'test@example.com',
      password: '123456',
    };

    it('Should fail with empty email', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          password: '12334',
        })
        .expectStatus(400);
    });

    it('Should fail with empty password', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          email: 'egg@abc.com',
        })
        .expectStatus(400);
    });

    it('Sign in', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto)
        .expectStatus(201)
        .stores('UserAt', 'access_token');
    });

    it('Sign up', () => {
      return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200);
    });
  });

  describe('user', () => {
    it('should return 401 without token', () => {
      return pactum.spec().get('/users/me').expectStatus(401);
    });

    it('should get current user', () => {
      return pactum.spec().get('/users/me').expectStatus(200).withHeaders({
        Authorization: 'Bearer ${userAt}',
      });
    });
  });

  // describe(('Edit user') => {

  //   })
  // })

  // describe(('Bookmarks') => {
  //   describe(('Create bookmark') => {
  //   })

  //   describe(('View Bookmark') => {
  //   })

  //   describe(('Edit bookmark') => {

  //   })

  //   describe(('Delete Bookmark') => {

  //   })
});
