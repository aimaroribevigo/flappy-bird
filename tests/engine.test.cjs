const {test} = require('node:test');
const assert = require('node:assert/strict');
const {Flight,FLOOR} = require('../engine.js');
test('flap starts flight and gravity makes bird fall',()=>{const g=new Flight();g.flap();g.step(1/60);assert.equal(g.state,'playing');assert.ok(g.y<270);for(let i=0;i<200;i++)g.step(1/60);assert.equal(g.state,'dead');assert.ok(g.y<=FLOOR-15);});
test('pause freezes simulation and resume continues',()=>{const g=new Flight();g.flap();g.pause();const y=g.y;g.step(1/60);g.flap();assert.equal(g.y,y);assert.equal(g.state,'paused');g.pause();g.step(1/60);assert.notEqual(g.y,y);});
test('passing a pipe scores exactly once',()=>{const g=new Flight();g.flap();g.pipes=[{x:48,top:100,gap:300,scored:false}];assert.deepEqual(g.step(1/120),['point']);g.step(1/120);assert.equal(g.score,1);});
test('pipe collision ends flight without granting a point',()=>{const g=new Flight();g.flap();g.pipes=[{x:130,top:290,gap:180,scored:false}];assert.deepEqual(g.step(1/120),['hit']);assert.equal(g.state,'dead');assert.equal(g.score,0);});
test('reset clears score, obstacles, and restores ready state',()=>{const g=new Flight();g.flap();g.score=12;g.reset();assert.equal(g.score,0);assert.equal(g.state,'ready');assert.deepEqual(g.pipes,[]);});
test('generated gaps stay within playable field',()=>{for(const r of [0,.5,.999]){const g=new Flight(()=>r);g.flap();g.spawn=0;g.step(1/120);assert.ok(g.pipes[0].top>=90);assert.ok(g.pipes[0].top+g.pipes[0].gap<=FLOOR-90);}});
