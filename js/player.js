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
  render() {
    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.
    this.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Now instantiate your objects.
  // Place all enemy objects in an array called allEnemies
  // Place the player object in a variable called player
}
