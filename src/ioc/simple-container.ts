export type Token = string;

type Registration = {
  ctor: any;
  deps: Token[];
  singleton?: boolean;
  instance?: any;
};

export class SimpleContainer {
  private regs = new Map<Token, Registration>();

  register(token: Token, ctor: any, deps: Token[] = [], singleton = false) {
    this.regs.set(token, { ctor, deps, singleton });
  }

  resolve<T = any>(token: Token): T {
    const reg = this.regs.get(token);
    if (!reg) throw new Error(`Token not registered: ${token}`);

    if (reg.singleton && reg.instance) return reg.instance;

    const deps = reg.deps.map(d => this.resolve(d));
    const instance = new reg.ctor(...deps);

    if (reg.singleton) reg.instance = instance;
    return instance;
  }
}
