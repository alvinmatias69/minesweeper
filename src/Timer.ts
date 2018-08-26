import Counter from './Counter';

export default class Timer extends Counter {
  private time: number;
  private intervalID: number;

  constructor() {
    super('timer', 0);
    this.time = 0;
    this.intervalID = 0;
  }

  public start() {
    this.intervalID = setInterval(() => {
      this.time++;
      this.set(this.time.toString());
    }, 1000);
  }

  public reset() {
    this.time = 0;
    this.set(this.time.toString());
    this.stop();
    this.start();
  }

  public stop() {
    clearInterval(this.intervalID);
  }
}