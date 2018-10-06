import boy from '../images/char-boy.png';
import Resources from './resources';
import { rectWidth, rectHeight } from './constants';

function inRange(x, [lower, upper]) {
  return x >= lower && x <= upper;
}

// Enemies our player must avoid
export default class Player {
  constructor(ctx, columns, rows) {
    Object.assign(this, {
      ctx,
      columns,
      rows,
      sprite: boy,
    });
    this.resetCoordinate();
    this.rangeOfY = [this.y - (this.rows - 1) * rectHeight, this.y];
    this.rangeOfX = [0, (this.columns - 1) * rectWidth];

    const div = document.createElement('div');
    document.body.appendChild(div);
    this.div = div;
  }

  resetCoordinate() {
    const x = rectWidth * 2;
    const y = rectHeight * 4.5;
    this.x = x;
    this.y = y;
  }

  get velocity() {
    if (!this._velocity) {
      this._velocity = ~~(Math.random() * 200) + 100;
    }
    return this._velocity;
  }

  set velocity(val) {
    this._velocity = 0;
  }

  // Draw the enemy on the screen, required method for game
  render(x = this.x, y = this.y) {
    if (!inRange(x, this.rangeOfX)) return;
    if (!inRange(y, this.rangeOfY)) return;
    this.ctx.drawImage(Resources.get(this.sprite), x, y);
    this.x = x;
    this.y = y;
  }

  sendPlayerPosition(x, y) {
    const moveEvent = new CustomEvent('move', {
      bubbles: true,
      detail: { x, y },
    });
    this.div.dispatchEvent(moveEvent);
  }

  handleInput(key) {
    const direction = key.slice(5).toLowerCase();
    switch (direction) {
    case 'up':
      this.render(this.x, this.y - rectHeight);
      // 抵达水域
      if (this.y < 0.5 * rectHeight) {
        // 使用自定义事件来通知玩家胜出
        const winnerEvent = new CustomEvent('winner', { bubbles: true });
        this.div.dispatchEvent(winnerEvent);
      }
      break;
    case 'down':
      this.render(this.x, this.y + rectHeight);
      break;
    case 'left':
      this.render(this.x - rectWidth, this.y);
      break;
    case 'right':
      this.render(this.x + rectWidth, this.y);
      break;
    default:
      return;
    }
    this.sendPlayerPosition(this.x, this.y);
  }
}
