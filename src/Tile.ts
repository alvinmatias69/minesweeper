import * as styles from './styles/Tile.css';

const colors: string[] = ['#4475A0', '#D75F35', '#C59C1F', '#5E9024', '#415B9F', '#714C97', '#926F48', '#A2534A'];

export default class Tile {
  private label: string;
  private onclick: () => void;
  private disabled: boolean;
  public element: HTMLButtonElement;
  public revealed: boolean;
  public flagged: boolean;

  constructor(label: string, onclick: () => void, onRightClick: () => void) {
    this.label = label;
    this.onclick = onclick;
    this.disabled = false;
    this.revealed = false;
    this.flagged = false;

    const button = document.createElement('button');
    button.onclick = onclick;
    button.oncontextmenu = () => {
      this.toggleFlag();
      onRightClick();
      return false;
    };
    button.classList.add(styles.tile);
    this.element = button;
  }

  private toggleFlag() {
    if (!this.revealed) {
      this.flagged = !this.flagged;
      if (this.flagged) {
        this.setFlag();
      } else {
        this.element.innerHTML = '';
      }
    }
  }

  public setFlag() {
    this.element.innerHTML = '';
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-flag');
    icon.style.cssText = 'color: #44A3C3';
    this.element.appendChild(icon);

  }

  public isMines() {
    return this.label === 'x';
  }

  public isBlank() {
    return this.label === '0';
  }

  public showLabel() {
    this.element.classList.add(styles.active);
    if (this.isMines()) {
      if (!this.element.firstChild) {
        const icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-bomb');
        this.element.appendChild(icon);
      }
    } else {
      this.element.innerText = this.isBlank() ? '' : this.label;
      this.element.style.cssText = `color: ${colors[parseInt(this.label) - 1]};`
    }
    this.revealed = true;
  }

  public toggleDisable() {
    this.disabled = !this.disabled;
    this.element.disabled = this.disabled;
  }
}