import bug from '../images/enemy-bug.png';
import Resources from './resources';

// Enemies our player must avoid
export default class Enemy {
  constructor(ctx, columns) {
    const height = 70;
    this.setCoordinate(height);
    this.maxX = height * columns;
    this.ctx = ctx;
    this.sprite = bug;
    this.height = height;
  }

  setCoordinate(height) {
    const x = -100;
    const range = 3;
    const y = [...Array(range).keys()].map(i => (i + 1) * height)[
      ~~(Math.random() * 1000) % range
    ];
    this.x = x;
    this.y = y;
  }

  get velocity() {
    if (!this._velocity) {
      this._velocity = ~~(Math.random() * 300) + 100;
    }
    return this._velocity;
  }

  set velocity(val) {
    this._velocity = 0;
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    const nextX = this.x + this.velocity * dt;
    if (nextX <= this.maxX + 50) {
      this.ctx.drawImage(Resources.get(this.sprite), nextX, this.y);
      this.x = nextX;
    } else {
      this.velocity = 0;
      this.setCoordinate(this.height);
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
  }

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
