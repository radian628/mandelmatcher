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

document.addEventListener("mousemove", (e) => {
  mousePos = { x: e.clientX, y: e.clientY };
});

document.addEventListener("mousedown", (e) => {
  mouseButtonsPressed.set(e.button, true);
});

document.addEventListener("mouseup", (e) => {
  for (const btn of mouseButtonsPressed.keys())
    mouseButtonsPressed.set(btn, false);
});

let fine = false;

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "f") fine = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() === "f") fine = false;
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});

enum ScrollType {
  Negative,
  Positive,
  None,
}

let lastScrollPositive = ScrollType.None;

document.addEventListener("wheel", (e) => {
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

function lerp(a, b, x) {
  return b * x + a * (1 - x);
}

function printParams() {
  console.log({
    bottomLeft: { ...userBottomLeft },
    topRight: { ...userTopRight },
    fractalIndex,
    params: { ...userTargetParams },
  });
}

const fractalsMatched = document.getElementById("fractals-matched")!;

function loadLevel(level: Level) {
  targetBottomLeft = { ...level.bottomLeft };
  targetTopRight = { ...level.topRight };
  targetParams = { ...level.params };
  fractalsMatched.innerText = `Fractals Matched ${levelIndex}/${LEVELS.length}`;
}

loadLevel(LEVELS[0]);

// @ts-expect-error this property doesn't exist
window.printParams = printParams;

(async () => {
  const set = (await setupGL())!;

  let prevMousePos = { x: 0, y: 0 };

  function loop() {
    const winDist = (userTopRight.x - userBottomLeft.x) / 50;
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
      levelIndex++;
      loadLevel(LEVELS[levelIndex]);
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
      scrollVel += fine ? 0.01 : 0.1;
    } else if (lastScrollPositive === ScrollType.Negative) {
      scrollVel -= fine ? 0.01 : 0.1;
    }
    scrollVel *= 0.75;
    lastScrollPositive = ScrollType.None;

    const factor = scrollVel;

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
    set("1f", "iterations", 64);
    set("2f", "resolution", window.innerWidth, window.innerHeight);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(loop);
  }

  loop();
})();
