import boy from '../images/char-boy.png';
import Resources from './resources';
import { rectWidth, rectHeight } from './constants';

// Enemies our player must avoid
export default class Player {
  constructor(ctx, columns) {
    this.setCoordinate();
    this.ctx = ctx;
    this.sprite = boy;
  }

  setCoordinate() {
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

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {}

  // Draw the enemy on the screen, required method for game
  render(x = this.x, y = this.y) {
    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.
    this.ctx.drawImage(Resources.get(this.sprite), x, y);
    this.x = x;
    this.y = y;
  }

  handleInput(key) {
    const direction = key.slice(5).toLowerCase();
    switch (direction) {
    case 'up':
      this.render(this.x, this.y - rectHeight);
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
      break;
    }
  }

  movePlayer(x, y) {
    this.render(x, y);
  }
}
