self.addEventListener('message', ({ data }) => {
  const { enemiesPosition = [], player } = data;

  for (let i = 0; i < enemiesPosition.length; i += 2) {
    const x = enemiesPosition[i];
    const y = enemiesPosition[i + 1];
    if (Math.abs(x - player[0]) <= 30 && Math.abs(y - player[1]) <= 30) {
      self.postMessage('lose');
      return;
    }
  }
});
