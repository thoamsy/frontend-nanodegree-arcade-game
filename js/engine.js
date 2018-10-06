import stone from '../images/stone-block.png';
import water from '../images/water-block.png';
import grass from '../images/grass-block.png';
import bug from '../images/enemy-bug.png';
import charboy from '../images/char-boy.png';

import Enemy from './enemy';
import Resources from './resources';

const squareWidth = 101;
const columns = 5;
const rows = 6;

export default class Engine {
  constructor(countOfEnemies = 5) {
    const { document: doc } = window;
    const canvas = doc.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = squareWidth * columns;
    canvas.height = squareWidth * rows;
    doc.body.appendChild(canvas);

    this.lastTime = 0;
    this.canvas = canvas;
    this.ctx = ctx;

    this.allEnemies = [...Array(countOfEnemies).keys()].map(() => {
      return new Enemy(ctx, columns);
    });
    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([stone, water, grass, bug, charboy]);
    Resources.onReady(this.init);
  }

  /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
  init = () => {
    this.reset();
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

  update(dt) {
    this.updateEntities(dt);
    // checkCollisions();
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
    // player.update();
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
        /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
        this.ctx.drawImage(
          Resources.get(rowImages[row]),
          col * squareWidth,
          row * 83
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
    // player.render();
  }

  /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
  reset() {
    // noop
  }
}
