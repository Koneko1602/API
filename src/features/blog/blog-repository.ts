export type Post = { id: string; title: string; content: string };

export class BlogRepository {
  private items: Post[] = [];

  async create(post: Omit<Post, 'id'>): Promise<Post> {
    const created: Post = { id: String(Date.now()) + Math.random().toString(36).slice(2,8), ...post };
    this.items.push(created);
    return created;
  }

  async findAll(): Promise<Post[]> {
    return [...this.items];
  }

  // helper for tests
  async clear() {
    this.items = [];
  }
}
