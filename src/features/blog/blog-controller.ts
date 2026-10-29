import { BlogService } from './blog-service';
import { Request, Response, Application } from 'express';

export class BlogController {
  constructor(private svc: BlogService) {}

  registerRoutes(app: Application) {
    app.post('/blog', this.create.bind(this));
    app.get('/blog', this.list.bind(this));
  }

  async create(req: Request, res: Response) {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'title and content required' });
    const post = await this.svc.createPost(title, content);
    res.status(201).json(post);
  }

  async list(req: Request, res: Response) {
    const posts = await this.svc.listPosts();
    res.json(posts);
  }
}
