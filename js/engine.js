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
  constructor(countOfEnemies = 8) {
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

    const worker = new Worker('./collision-worker.js');
    this.worker = worker;
    this.enemiesPosition = new Int16Array(countOfEnemies * 2);
    this.worker.onmessage = ({ data }) => {
      if (data === 'lose') {
        this.player.resetCoordinate();
      }
    };

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
    // 因为直接作用到 body 的事件，不需要考虑垃圾回收
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
    this.checkCollisions();
  }

  checkCollisions() {
    // 如果玩家还在草地上，不需要碰撞检测。
    if (this.player.y >= rectHeight * 3) return;
    const positions = (this.allEnemies ?? []).reduce(
      (position, { x, y }) => position.concat([~~x, ~~y]), // 防止出现浮点数的情况
      []
    );
    this.enemiesPosition.set(positions);
    this.worker.postMessage({
      enemiesPosition: this.enemiesPosition,
      player: { x: this.player.x, y: this.player.y },
    });
    return;
    // 不使用 forEach，因为无法提前退出循环
  }

  updateEntities(dt) {
    this.allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
  }

  render() {
    const rowImages = [water, stone, stone, stone, grass, grass];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

  renderEntities() {
    this.allEnemies.forEach(enemy => {
      enemy.render();
    });
    this.player.render();
  }

  reset() {
    this.allEnemies = null;
    this.player = null;
    this.initRole();
  }
}
