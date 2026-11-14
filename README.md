# Flappy Bird · Little Arcade

Juego de navegador inspirado en Flappy Bird, con ilustraciones originales dibujadas en Canvas. Interfaz en español, diseño adaptable, dificultad progresiva, récord local y sonidos sintetizados. No requiere dependencias ni compilación.

## Jugar

Abre `index.html` en tu navegador, o usa Node.js 18 o posterior:

```sh
npm start
```

Visita http://127.0.0.1:4173.

- **Espacio / flecha arriba / clic / toque:** aletear y comenzar otra partida.
- **P:** pausar o continuar. También se pausa al ocultar la pestaña.
- **M:** activar o silenciar sonido (desactivado al iniciar).

Esquiva las tuberías sin tocar los bordes. Cada tubería superada suma un punto. El récord se guarda en el navegador si el almacenamiento está disponible.

## Comprobación

```sh
npm test
```

Las pruebas verifican gravedad, pausa, colisiones, puntuación, reinicio y generación de obstáculos. La simulación usa pasos de tiempo fijos, independientes de la tasa de refresco de la pantalla.

## Archivos

- `index.html`, `style.css`: interfaz adaptable.
- `engine.js`: simulación independiente del navegador.
- `game.js`: dibujo, controles, audio y almacenamiento.
- `server.cjs`: servidor local opcional.

Las fuentes se cargan desde Google Fonts; sin conexión se usan fuentes del sistema. El juego funciona sin recursos gráficos ni servicios externos. Proyecto de homenaje independiente, sin afiliación con el creador del juego original y sin sus recursos gráficos o sonoros.
