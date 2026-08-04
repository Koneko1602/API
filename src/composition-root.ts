import express from 'express';
import { SimpleContainer } from './ioc/simple-container';
import { BlogRepository } from './features/blog/blog-repository';
import { BlogService } from './features/blog/blog-service';
import { BlogController } from './features/blog/blog-controller';

export function createApp() {
  const app = express();
  app.use(express.json());

  const container = new SimpleContainer();
  // register bindings
  container.register('BlogRepository', BlogRepository, [], true); // singleton
  container.register('BlogService', BlogService, ['BlogRepository']);
  container.register('BlogController', BlogController, ['BlogService']);

  const blogController = container.resolve<BlogController>('BlogController');
  blogController.registerRoutes(app);

  // health
  app.get('/health', (req, res) => res.json({ ok: true }));

  return app;
}
