import {
  createProgramFromShaderSources,
  FULLSCREEN_QUAD,
  makeUniformSetter,
} from "./gl-lib";
import { Level, LEVELS } from "./levels";

const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
)! as HTMLCanvasElement;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resize);

const gl = canvas.getContext("webgl2")!;

resize();

export async function setupGL() {
  gl.viewport(0, 0, canvas.width, canvas.height);

  const vertexSource = await (await fetch("./fractal.vert")).text();
  const fragmentSource = await (await fetch("./fractal.frag")).text();
  const prog = createProgramFromShaderSources(gl, vertexSource, fragmentSource);
  if (!prog) {
    return;
  }

  const set = makeUniformSetter(gl, prog);

  // setup vao
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // setup quad buffer
  const fullscreenQuadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenQuadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD, gl.STATIC_DRAW);

  gl.useProgram(prog);

  // per-vertex attribs
  const vertexPositionLocation = gl.getAttribLocation(prog, "vertex_position");
  gl.enableVertexAttribArray(vertexPositionLocation);
  gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 8, 0);

  return set;
}

let mousePos = { x: 0, y: 0 };
let mouseButtonsPressed = new Map<number, boolean>();

canvas.addEventListener("mousemove", (e) => {
  mousePos = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener("mousedown", (e) => {
  mouseButtonsPressed.set(e.button, true);
});

canvas.addEventListener("mouseup", (e) => {
  for (const btn of mouseButtonsPressed.keys())
    mouseButtonsPressed.set(btn, false);
});

let fine = false;

canvas.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "f") fine = true;
});

canvas.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() === "f") fine = false;
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});

const touches = new Map<
  number,
  {
    x: number;
    y: number;
    dx: number;
    dy: number;
  }
>();

canvas.addEventListener("touchstart", (e) => {
  for (const t of e.touches) {
    touches.set(t.identifier, { x: t.clientX, y: t.clientY, dx: 0, dy: 0 });
  }
});

canvas.addEventListener("touchmove", (e) => {
  for (const t of e.touches) {
    const oldTouch = touches.get(t.identifier);
    if (oldTouch) {
      touches.set(t.identifier, {
        x: t.clientX,
        y: t.clientY,
        dx: t.clientX - oldTouch.x + oldTouch.dx,
        dy: t.clientY - oldTouch.y + oldTouch.dy,
      });
    } else {
      touches.set(t.identifier, { x: t.clientX, y: t.clientY, dx: 0, dy: 0 });
    }
  }
});

canvas.addEventListener("touchend", (e) => {
  for (const t of e.changedTouches) {
    touches.delete(t.identifier);
  }
});

canvas.addEventListener("touchcancel", (e) => {
  for (const t of touches.keys()) {
    touches.delete(t);
  }
});

enum ScrollType {
  Negative,
  Positive,
  None,
}

let lastScrollPositive = ScrollType.None;

canvas.addEventListener("wheel", (e) => {
  lastScrollPositive = e.deltaY > 0 ? ScrollType.Positive : ScrollType.Negative;
});

let userBottomLeft = { x: -2, y: -2 };
let userTopRight = { x: 2, y: 2 };
let userParams = { x: 0.2, y: -0.6 };
let userTargetParams = { x: 0.2, y: -0.6 };
let scrollVel = 0;
let fractalIndex = 1;
let levelIndex = 0;

let targetBottomLeft = { x: 0, y: 0 };
let targetTopRight = { x: 0, y: 0 };
let targetParams = { x: 0, y: 0 };

let winAnimationFrame = 0;
let winAnimationRunning = false;

function lerp(a, b, x) {
  return b * x + a * (1 - x);
}

function smoothstep(x) {
  return 3 * x * x - 2 * x * x * x;
}

function smoothlerp(a, b, x) {
  return lerp(a, b, smoothstep(x));
}

function printParams() {
  console.log({
    bottomLeft: { ...userBottomLeft },
    topRight: { ...userTopRight },
    fractalIndex,
    params: { ...userTargetParams },
  });
}

function loadLevel(level: Level) {
  targetBottomLeft = { ...level.bottomLeft };
  targetTopRight = { ...level.topRight };
  targetParams = { ...level.params };
}

loadLevel(LEVELS[0]);

// @ts-expect-error this property doesn't exist
window.printParams = printParams;

const matchFound = document.getElementById("match-found")!;

const info = document.getElementById("info")!;

const startButton = document.getElementById("start")!;
startButton.addEventListener("click", (e) => {
  info.style.display = "none";
});

(async () => {
  const set = (await setupGL())!;

  let prevMousePos = { x: 0, y: 0 };

  function loop() {
    const winDist = (userTopRight.x - userBottomLeft.x) / 20;
    if (
      Math.hypot(
        targetTopRight.x - userTopRight.x,
        targetTopRight.y - userTopRight.y
      ) < winDist &&
      Math.hypot(
        targetBottomLeft.x - userBottomLeft.x,
        targetTopRight.y - userTopRight.y
      ) < winDist
    ) {
      winAnimationRunning = true;
    }

    if (winAnimationRunning) {
      winAnimationFrame++;
    }

    if (winAnimationFrame > 0 && winAnimationFrame < 120) {
      userBottomLeft = {
        x: lerp(userBottomLeft.x, targetBottomLeft.x, 0.1),
        y: lerp(userBottomLeft.y, targetBottomLeft.y, 0.1),
      };
      userTopRight = {
        x: lerp(userTopRight.x, targetTopRight.x, 0.1),
        y: lerp(userTopRight.y, targetTopRight.y, 0.1),
      };
    }

    matchFound.style.opacity = smoothstep(
      1 - Math.min(Math.max(Math.abs(winAnimationFrame - 120) / 60 - 1, 0), 1)
    ).toString();

    if (winAnimationFrame == 120) {
      levelIndex++;
      loadLevel(LEVELS[levelIndex]);
      userBottomLeft = { x: -2, y: -2 };
      userTopRight = { x: 2, y: 2 };
      userParams = { x: 0.2, y: -0.6 };
      userTargetParams = { x: 0.2, y: -0.6 };
    }

    if (winAnimationFrame >= 240) {
      winAnimationRunning = false;
      winAnimationFrame = 0;
    }

    const touchValues = [...touches.values()];

    if (touchValues.length === 1) {
      let deltaX =
        -(touchValues[0].dx / window.innerHeight) *
        (userTopRight.y - userBottomLeft.y);
      let deltaY =
        (touchValues[0].dy / window.innerHeight) *
        (userTopRight.y - userBottomLeft.y);

      userBottomLeft.x += deltaX;
      userBottomLeft.y += deltaY;
      userTopRight.x += deltaX;
      userTopRight.y += deltaY;

      touchValues[0].dx = 0;
      touchValues[0].dy = 0;
    } else if (touchValues.length === 2) {
      let deltaX =
        -((touchValues[0].dx + touchValues[1].dx) / 2 / window.innerHeight) *
        (userTopRight.y - userBottomLeft.y);
      let deltaY =
        ((touchValues[0].dy + touchValues[1].dy) / 2 / window.innerHeight) *
        (userTopRight.y - userBottomLeft.y);

      userBottomLeft.x += deltaX;
      userBottomLeft.y += deltaY;
      userTopRight.x += deltaX;
      userTopRight.y += deltaY;

      const zoomAmount =
        Math.hypot(
          touchValues[0].x - touchValues[1].x,
          touchValues[0].y - touchValues[1].y
        ) /
        Math.hypot(
          touchValues[0].x -
            touchValues[0].dx -
            touchValues[1].x +
            touchValues[1].dx,
          touchValues[0].y -
            touchValues[0].dy -
            touchValues[1].y +
            touchValues[1].dy
        );

      let originX = lerp(userBottomLeft.x, userTopRight.x, 0.5);
      let originY = lerp(userBottomLeft.y, userTopRight.y, 0.5);

      userBottomLeft.x = lerp(userBottomLeft.x, originX, zoomAmount);
      userBottomLeft.y = lerp(userBottomLeft.y, originY, zoomAmount);

      userTopRight.x = lerp(userTopRight.x, originX, zoomAmount);
      userTopRight.y = lerp(userTopRight.y, originY, zoomAmount);

      touchValues[0].dx = 0;
      touchValues[0].dy = 0;
      touchValues[1].dx = 0;
      touchValues[1].dy = 0;
    }

    if (mouseButtonsPressed.get(0)) {
      let deltaX =
        ((prevMousePos.x - mousePos.x) / window.innerHeight) *
        (userTopRight.y - userBottomLeft.y);
      let deltaY =
        ((mousePos.y - prevMousePos.y) / window.innerHeight) *
        (userTopRight.y - userBottomLeft.y);

      userBottomLeft.x += deltaX;
      userBottomLeft.y += deltaY;
      userTopRight.x += deltaX;
      userTopRight.y += deltaY;
    }

    if (mouseButtonsPressed.get(2)) {
      userTargetParams.x = (mousePos.x / window.innerWidth) * 2 - 1;
      userTargetParams.y = (mousePos.y / window.innerHeight) * 2 - 1;
    }
    userParams = {
      x: lerp(userParams.x, userTargetParams.x, 0.3),
      y: lerp(userParams.y, userTargetParams.y, 0.3),
    };

    if (lastScrollPositive === ScrollType.Positive) {
      scrollVel += fine ? 0.005 : 0.03;
    } else if (lastScrollPositive === ScrollType.Negative) {
      scrollVel -= fine ? 0.005 : 0.03;
    }
    scrollVel *= 0.75;
    lastScrollPositive = ScrollType.None;

    let factor = scrollVel;
    if (userTopRight.x - userBottomLeft.x > 10) {
      factor = Math.max(factor, 0);
    }
    if (userTopRight.x - userBottomLeft.x < 0.0000001) {
      factor = Math.min(factor, 0);
    }

    let originX = lerp(userBottomLeft.x, userTopRight.x, 0.5);
    let originY = lerp(userBottomLeft.y, userTopRight.y, 0.5);

    userBottomLeft.x = lerp(userBottomLeft.x, originX, factor);
    userBottomLeft.y = lerp(userBottomLeft.y, originY, factor);

    userTopRight.x = lerp(userTopRight.x, originX, factor);
    userTopRight.y = lerp(userTopRight.y, originY, factor);

    prevMousePos = mousePos;

    // set uniforms to something sensible
    set("2f", "target_params", targetParams.x, targetParams.y);
    set("2f", "target_bottom_left", targetBottomLeft.x, targetBottomLeft.y);
    set("2f", "target_top_right", targetTopRight.x, targetTopRight.y);
    set("2f", "user_params", userParams.x, userParams.y);
    set("2f", "user_bottom_left", userBottomLeft.x, userBottomLeft.y);
    set("2f", "user_top_right", userTopRight.x, userTopRight.y);
    set("1i", "fractal", fractalIndex);
    set(
      "1f",
      "iterations",
      Math.ceil(
        smoothlerp(
          0,
          64,
          Math.abs(Math.max(0, Math.abs((winAnimationFrame - 120) / 60) - 1))
        )
      )
    );
    set("2f", "resolution", window.innerWidth, window.innerHeight);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(loop);
  }

  loop();
})();
