/* Pure game simulation shared by the browser and Node tests. */
(function (root) {
  'use strict';
  const W = 480, H = 640, FLOOR = 574, X = 136, R = 15;
  class Flight {
    constructor(random = Math.random) { this.random = random; this.reset(); }
    reset() { this.y = 270; this.vy = 0; this.pipes = []; this.score = 0; this.elapsed = 0; this.spawn = 0.85; this.state = 'ready'; }
    flap() { if (this.state === 'dead' || this.state === 'paused') return; this.state = 'playing'; this.vy = -330; }
    pause() { if (this.state === 'playing') this.state = 'paused'; else if (this.state === 'paused') this.state = 'playing'; }
    step(dt) {
      if (this.state !== 'playing') return [];
      dt = Math.min(dt, 1 / 30);
      const events = [];
      this.elapsed += dt;
      this.vy += 1000 * dt; this.y += this.vy * dt;
      this.spawn -= dt;
      const speed = Math.min(205, 158 + this.score * 1.5);
      if (this.spawn <= 0) {
        const gap = Math.max(158, 184 - this.score * .65);
        this.pipes.push({ x: W + 24, top: 90 + this.random() * (FLOOR - gap - 180), gap, scored: false });
        this.spawn += 1.65;
      }
      for (const p of this.pipes) {
        p.x -= speed * dt;
        if (X + R > p.x - 5 && X - R < p.x + 72 + 5 && (this.y - R < p.top || this.y + R > p.top + p.gap)) this.state = 'dead';
      }
      if (this.y + R >= FLOOR || this.y - R <= 0) this.state = 'dead';
      if (this.state === 'dead') { this.y = Math.max(R, Math.min(FLOOR - R, this.y)); return ['hit']; }
      for (const p of this.pipes) if (!p.scored && p.x + 72 < X - R) { p.scored = true; this.score++; events.push('point'); }
      this.pipes = this.pipes.filter(p => p.x > -90);
      return events;
    }
  }
  const api = { Flight, W, H, FLOOR, X, R };
  if (typeof module !== 'undefined') module.exports = api; else root.FlappyEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
