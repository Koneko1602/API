import request from 'supertest';
import { createApp } from '../src/composition-root';
import { BlogRepository } from '../src/features/blog/blog-repository';

let app: any;
let repo: BlogRepository | null = null;

beforeAll(() => {
  app = createApp();
});

afterEach(async () => {
  // try to clear repository if accessible via test container: resolve pattern not exported, so import repo directly
  try {
    // create a fresh instance to access clear - in this simple design, repository inside app is a singleton inside container,
    // but tests can rely on API behaviour and not share state; to be safe, call POST endpoints to reset state isn't available.
  } catch (e) {
    // ignore
  }
});

test('POST /blog creates a post and GET /blog returns it', async () => {
  const title = 'Test title';
  const content = 'Test content';

  const createRes = await request(app).post('/blog').send({ title, content }).expect(201);
  expect(createRes.body).toMatchObject({ title, content, id: expect.any(String) });

  const listRes = await request(app).get('/blog').expect(200);
  expect(Array.isArray(listRes.body)).toBe(true);
  expect(listRes.body.length).toBeGreaterThanOrEqual(1);
  expect(listRes.body.some((p: any) => p.title === title && p.content === content)).toBe(true);
});
