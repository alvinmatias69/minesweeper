import Counter from "./Counter";

export default class Mines extends Counter {
  private count: number;

  constructor(count: number) {
    super('mines', count);

    this.count = count;
  }

  public changeCount(count: number) {
    this.count = this.count + count;
    this.set(this.count.toString());
  }

  public setCount(count: number) {
    this.count = count;
    this.set(this.count.toString());
  }
}