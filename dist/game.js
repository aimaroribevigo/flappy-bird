'use strict';
(() => {
  const { Flight, W, H, FLOOR, X } = FlappyEngine;
  const model = new Flight();
  const $ = id => document.getElementById(id);
  const canvas = $('game'), ctx = canvas.getContext('2d');
  let best = 0, muted = true, audio, previous = 0, accumulator = 0, scenery = 0, deathAt = 0;
  try { best = Number(localStorage.getItem('little-arcade-best')) || 0; } catch {}
  $('best').textContent = best;
  function tone(freq, duration, type = 'sine') {
    if (muted) return;
    try {
      audio ??= new (window.AudioContext || window.webkitAudioContext)();
      audio.resume();
      const osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, audio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, audio.currentTime + duration);
      gain.gain.setValueAtTime(.06, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
      osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + duration);
    } catch {}
  }
  function overlay(pill, title, subtitle, button, hint) {
    $('pill').textContent = pill; $('message').textContent = title; $('subtitle').textContent = subtitle;
    $('play').replaceChildren(document.createTextNode(button + ' '), Object.assign(document.createElement('span'), { textContent: '↗' }));
    $('hint').textContent = hint; $('overlay').classList.remove('hidden');
  }
  function flap() {
    if (model.state === 'paused') return;
    if (model.state === 'dead') { if (performance.now() - deathAt < 450) return; model.reset(); }
    model.flap(); tone(650, .09); $('overlay').classList.add('hidden'); $('pause').disabled = false; $('score').textContent = model.score;
  }
  function pause() {
    model.pause();
    if (model.state === 'paused') {
      overlay('TOMA UN RESPIRO', 'Vuelo en pausa.', 'Tu próxima tubería puede esperar.', 'Continuar', 'P PARA CONTINUAR');
      $('pause').textContent = '▶'; $('pause').setAttribute('aria-label', 'Continuar partida');
    } else if (model.state === 'playing') {
      $('overlay').classList.add('hidden'); $('pause').textContent = 'Ⅱ'; $('pause').setAttribute('aria-label', 'Pausar partida');
    }
    accumulator = 0;
  }
  function toggleSound() { muted = !muted; $('sound').setAttribute('aria-pressed', String(!muted)); $('sound').setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar sonido'); $('sound').style.opacity = muted ? '.5' : '1'; tone(700, .12); }
  $('play').addEventListener('click', () => { model.state === 'paused' ? pause() : flap(); canvas.focus({ preventScroll: true }); });
  $('frame').addEventListener('pointerdown', e => { if (e.target.closest('button')) return; e.preventDefault(); flap(); canvas.focus({ preventScroll: true }); });
  $('pause').addEventListener('click', pause); $('sound').addEventListener('click', toggleSound);
  document.addEventListener('keydown', e => {
    if (e.target.closest('button,a') && (e.code === 'Space' || e.code === 'Enter')) return;
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); if (!e.repeat) flap(); }
    if (e.code === 'KeyP' && !e.repeat) pause();
    if (e.code === 'KeyM' && !e.repeat) toggleSound();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && model.state === 'playing') pause(); });
  function ellipse(x,y,rx,ry,color) { ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill(); }
  function cloud(x,y,s) { ctx.fillStyle='#eff8eacc';ctx.beginPath();ctx.roundRect(x,y,78*s,20*s,10*s);ctx.fill();ellipse(x+22*s,y,17*s,18*s,'#eff8eacc');ellipse(x+47*s,y-7*s,23*s,25*s,'#eff8eacc'); }
  function pipe(x,y,h,top) {
    ctx.fillStyle='#3f6955';ctx.fillRect(x,y,72,h);
    ctx.fillStyle='#83ad6d';ctx.fillRect(x+4,y,64,h);
    ctx.fillStyle='#acc88a';ctx.fillRect(x+9,y,12,h);
    ctx.fillStyle='#648d58';ctx.fillRect(x+57,y,11,h);
    const cap = top ? y+h-25 : y;
    ctx.fillStyle='#3f6955';ctx.fillRect(x-5,cap,82,26);
    ctx.fillStyle='#8bb675';ctx.fillRect(x-1,cap+4,74,17);
    ctx.fillStyle='#b5cf91';ctx.fillRect(x+3,cap+4,12,17);
  }
  function bird(y, time) {
    ctx.save(); ctx.translate(X,y);ctx.rotate(model.state === 'ready' ? -.08 : Math.max(-.4,Math.min(1.15,model.vy/550)));
    ellipse(0,0,23,18,'#694d32');ellipse(0,-2,20,16,'#efc65f');ellipse(4,5,14,9,'#ffe5a0');
    ellipse(-12,5+Math.sin(time*18)*3,12,7,'#d99a47');ellipse(-12,3+Math.sin(time*18)*3,9,5,'#f4d174');
    ellipse(10,-7,8,9,'#fffef0');ellipse(13,-7,3,5,'#263e3b');
    ctx.fillStyle='#b76c3c';ctx.beginPath();ctx.moveTo(18,-1);ctx.lineTo(31,4);ctx.lineTo(18,9);ctx.closePath();ctx.fill();ctx.fillStyle='#f29551';ctx.fillRect(17,1,12,4);ctx.restore();
  }
  function draw(time) {
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#b5dfd7');sky.addColorStop(1,'#e2edc3');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    ellipse(387,86,35,35,'#fff5bd');
    for(let i=0;i<4;i++)cloud(((i*173-scenery*.12+650)%690)-100,95+(i%3)*67,.65+(i%2)*.35);
    ctx.fillStyle='#b9d5ba';ctx.beginPath();ctx.moveTo(0,440);for(let x=0;x<=W;x+=8)ctx.lineTo(x,420+Math.sin(x*.018+1)*25);ctx.lineTo(W,FLOOR);ctx.lineTo(0,FLOOR);ctx.fill();
    for(let i=0;i<12;i++) {const x=i*49-(scenery*.22%49);ellipse(x,533,40,42+(i%3)*9,'#a0c39a');ellipse(x+4,548,33,27,'#91b98b');}
    for(const p of model.pipes){pipe(p.x,0,p.top,true);pipe(p.x,p.top+p.gap,FLOOR-p.top-p.gap,false);}
    ctx.fillStyle='#4b7656';ctx.fillRect(0,FLOOR,W,5);ctx.fillStyle='#a3c47a';ctx.fillRect(0,FLOOR+5,W,13);
    for(let i=-1;i<26;i++){ctx.fillStyle='#c4d68e';ctx.beginPath();let x=i*23-scenery%23;ctx.moveTo(x,FLOOR+5);ctx.lineTo(x+12,FLOOR+5);ctx.lineTo(x+3,FLOOR+18);ctx.lineTo(x-9,FLOOR+18);ctx.fill();}
    ctx.fillStyle='#e7dab0';ctx.fillRect(0,FLOOR+18,W,H);ctx.fillStyle='#d9cba1';for(let i=0;i<33;i++)ctx.fillRect((i*31)%W,FLOOR+31+(i%3)*11,4,3);
    bird(model.state==='ready'?270+Math.sin(time*3)*7:model.y,time);
  }
  function loop(now) {
    const dt = Math.min((now-previous)/1000 || 0, .1);previous=now;
    if(model.state==='playing') {
      accumulator+=dt;
      while(accumulator>=1/120 && model.state==='playing') {
        const events=model.step(1/120);accumulator-=1/120;scenery+=158/120;
        if(events.includes('point')){tone(1000,.14);$('score').textContent=model.score;}
        if(events.includes('hit')) {
          deathAt=now;tone(160,.22,'triangle');$('pause').disabled=true;
          const record=model.score>best;if(record){best=model.score;try{localStorage.setItem('little-arcade-best',best);}catch{}}
          $('best').textContent=best;
          overlay(record?'¡NUEVO RÉCORD!':'CADA VUELO CUENTA', '¿Otra vez?', `Puntuación: ${model.score} · Tu récord: ${best}`, 'Volver a volar', 'ESPACIO · CLIC · TOQUE');
          $('announcement').textContent=`Fin de la partida. ${model.score} puntos. Récord: ${best}.`;
        }
      }
    } else {accumulator=0;if(model.state==='ready')scenery+=dt*25;}
    draw(model.state==='paused'?model.elapsed:now/1000);requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
