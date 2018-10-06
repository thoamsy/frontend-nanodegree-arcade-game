import stone from '../images/stone-block.png';
import water from '../images/water-block.png';
import grass from '../images/grass-block.png';
import bug from '../images/enemy-bug.png';
import charboy from '../images/char-boy.png';

import Enemy from './enemy';
import Player from './player';
import Resources from './resources';

import { columns, rows, rectWidth, rectHeight } from './constants';

export default class Engine {
  constructor(countOfEnemies = 5) {
    const { document: doc } = window;
    const canvas = doc.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = rectWidth * columns;
    canvas.height = rectWidth * rows;
    doc.body.appendChild(canvas);

    this.lastTime = 0;
    this.canvas = canvas;
    this.ctx = ctx;
    this.countOfEnemies = countOfEnemies;

    this.initRole();
    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([stone, water, grass, bug, charboy]);
    Resources.onReady(this.init);
  }

  initRole() {
    this.allEnemies = [...Array(this.countOfEnemies).keys()].map(() => {
      return new Enemy(this.ctx, columns);
    });
    this.player = new Player(this.ctx, columns, rows);
  }
  /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
  init = () => {
    this.reset();
    this.addKeyControl();
    this.addWinnerHandler();
    this.lastTime = performance.now();
    this.main();
  };

  main = () => {
    /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000.0;
    this.render();
    this.update(dt);
    this.lastTime = now;
    requestAnimationFrame(this.main);
  };

  addKeyControl = () => {
    document.body.addEventListener('keyup', e => {
      e.preventDefault();
      this.player.handleInput(e.key);
    });
  };

  addWinnerHandler = () => {
    document.body.addEventListener('winner', () => {
      this.reset();
      this.main();
    });
  };

  update(dt) {
    this.updateEntities(dt);
    // this.checkCollisions();
  }

  /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
  updateEntities(dt) {
    this.allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
  }

  /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
  render() {
    /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
    const rowImages = [water, stone, stone, stone, grass, grass];
    // Before drawing, clear existing canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        this.ctx.drawImage(
          Resources.get(rowImages[row]),
          col * rectWidth,
          row * rectHeight
        );
      }
    }

    this.renderEntities();
  }

  /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
  renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
    this.allEnemies.forEach(enemy => {
      enemy.render();
    });
    this.player.render();
  }

  /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
  reset() {
    this.allEnemies = null;
    this.player = null;
    this.initRole();
  }
}
