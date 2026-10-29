import { BlogRepository } from './blog-repository';

export class BlogService {
  constructor(private repo: BlogRepository) {}

  async createPost(title: string, content: string) {
    return this.repo.create({ title, content });
  }

  async listPosts() {
    return this.repo.findAll();
  }
}
