import Board from './Board';
import Timer from './Timer';
import Mines from './Mines';

import * as styles from './styles/Template.css';

enum Counter {
  mines = "mines",
  timer = "timer"
}

export default class Template {
  private board: Board;
  private header: HTMLDivElement;
  private timer: Timer;
  private mines: Mines;

  constructor() {
    this.board = new Board({ row: 9, column: 9 }, 10, (count: number) => this.mines.changeCount(count), (win: boolean) => this.onFinish(win));
    this.header = this.createHeader();
    this.mines = new Mines(10);
    this.timer = new Timer();

    this.generateHeader();
    this.timer.start();
  }

  private createHeader(): HTMLDivElement {
    const header = document.createElement('div');
    header.setAttribute('id', 'header');
    header.classList.add(styles.header);

    return header;
  }

  private generateHeader() {
    document.body.insertAdjacentElement('afterbegin', this.header);
    this.createCounter(Counter.mines);
    this.createGameButton();
    this.createCounter(Counter.timer);
  }

  private createCounter(type: Counter) {
    let element: HTMLSpanElement;
    if (type === Counter.timer) {
      element = this.timer.element;
    } else {
      element = this.mines.element;
    }

    const desc = document.createElement('span');
    desc.innerText = type.toString().toUpperCase();
    desc.classList.add(styles.description);

    const container = document.createElement('div');
    container.appendChild(element);
    container.appendChild(desc);
    container.style.cssText = 'display: flex; flex-direction: column; justify-content: center; align-items: center';

    this.header.appendChild(container);
  }

  private createGameButton() {
    const button = document.createElement('button');
    button.innerText = 'New Game!';
    button.classList.add(styles.newGame);
    button.addEventListener('click', () => {
      this.board.newGame({ row: 9, column: 9 }, 10);
      this.timer.reset();
      this.mines.setCount(10);
    });

    this.header.appendChild(button);
  }

  private onFinish(win: boolean = false) {
    if (win) {
      this.mines.setCount(0);
    }
    this.timer.stop();
  }
}