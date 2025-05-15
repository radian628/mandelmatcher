import {
  createProgramFromShaderSources,
  FULLSCREEN_QUAD,
  makeUniformSetter,
} from "./gl-lib";
import { Level, LEVELS } from "./levels";
import { loopSound, playSound } from "./sound";
import { findPointOnEdgeOfMandelbrot } from "./level-generator";
import seedrandom from "seedrandom";

const canvas: HTMLCanvasElement = document.getElementById(
  "canvas"
)! as HTMLCanvasElement;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

const params = new URLSearchParams(window.location.search);

function setParam(param: string, value: string) {
  const paramsTemp = new URLSearchParams(window.location.search);
  if (value) paramsTemp.set(param, value);
  else paramsTemp.delete(param);
  const url =
    window.location.origin +
    window.location.pathname +
    "?" +
    paramsTemp.toString();
  window.history.pushState(
    {
      path: url,
    },
    "",
    url
  );
}

const seedInput = document.getElementById("seed")! as HTMLInputElement;
seedInput.value = params.get("seed") ?? "";
seedInput.addEventListener("input", (e) => {
  setParam("seed", seedInput.value);
});

const difficultyInput = document.getElementById(
  "difficulty"
)! as HTMLSelectElement;
difficultyInput.value = params.get("difficulty") ?? "2";
difficultyInput.addEventListener("change", (e) => {
  setParam("difficulty", difficultyInput.value);
});

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

let isMusicPlayingYet = false;

canvas.addEventListener("mousedown", (e) => {
  if (!isMusicPlayingYet) {
    isMusicPlayingYet = true;
    loopSound("background-music.ogg", 0.5, 0.04);
  }
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

let scrollUntilNoise = 0;

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
  console.log(Math.round(1 / (userTopRight.x - userBottomLeft.x)));
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
// @ts-expect-error nor does this one
window.printZoomLevels = () => {
  return LEVELS.map((l) => Math.round(1 / (l.topRight.x - l.bottomLeft.x)));
};
// @ts-expect-error yeah
window.loadLevelIndex = (index: number) => {
  loadLevel(LEVELS[index]);
  levelIndex = index;
};

function draw(
  w: number,
  h: number,
  set: Exclude<Awaited<ReturnType<typeof setupGL>>, undefined>
) {
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
    Math.max(
      1,
      Math.ceil(
        smoothlerp(
          0,
          64,
          Math.abs(Math.max(0, Math.abs((winAnimationFrame - 120) / 60) - 1))
        )
      )
    )
  );
  set("2f", "resolution", w, h);
  set("1f", "hue_offset", hueOffset);
  // set("1f", "threshold", Math.sin(animationTime * 0.05) * 1096 + 1100);
  set("1f", "threshold", 4.0);
  set("1f", "animation_frame", animationTime);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

const matchFound = document.getElementById("match-found")!;
const levelsComplete = document.getElementById("levels-complete")!;

const info = document.getElementById("info")!;
const debugBox = document.getElementById("debug")!;

const startButton = document.getElementById("start")!;
startButton.addEventListener("click", (e) => {
  LEVELS.splice(0, LEVELS.length);
  info.style.display = "none";
  const seed =
    seedInput.value || Math.floor(Math.random() * 2 ** 52).toString();
  setParam("seed", seed);
  const rand = seedrandom(seed);
  let difficulty = Number(difficultyInput.value);
  if (isNaN(difficulty)) difficulty = 2;
  difficulty = Math.min(Math.max(difficulty, 1), 200);
  for (let i = 0; i < difficulty * 5; i++) {
    const pt = findPointOnEdgeOfMandelbrot(rand);
    const zoom = 1 / (2 + Math.pow(i, 1.5) * (1.5 + rand()));
    LEVELS.push({
      bottomLeft: { x: pt.x - zoom, y: pt.y - zoom },
      topRight: { x: pt.x + zoom, y: pt.y + zoom },
      params: { x: 0, y: 0 },
      fractalIndex: 1,
    });
  }
  loadLevel(LEVELS[0]);
});

let hueOffset = -0.1;

let animationTime = 0;

(async () => {
  const set = (await setupGL())!;

  let stopLooping = false;

  // @ts-expect-error and this one too lol
  window.printAllLevels = () => {
    stopLooping = true;
    const gridSize = Math.ceil(Math.sqrt(LEVELS.length));

    for (let i = 0; i < LEVELS.length; i++) {
      const lvl = LEVELS[i];

      const gridX = i % gridSize;
      const gridY = gridSize - Math.floor(i / gridSize) - 1;
      const gridYFlipped = Math.floor(i / gridSize);
      const gridWidth = Math.floor(window.innerWidth / gridSize);
      const gridHeight = Math.floor(window.innerHeight / gridSize);
      gl.viewport(gridX * gridWidth, gridY * gridHeight, gridWidth, gridHeight);
      loadLevel(lvl);
      userBottomLeft = { x: 100, y: 100 };
      userTopRight = { x: 100, y: 100 };
      draw(gridWidth, gridHeight, set);
      const label = document.createElement("div");
      label.innerHTML = `zoom: ${Math.round(
        1 / (targetTopRight.x - targetBottomLeft.x)
      )}`;
      label.style.position = "absolute";
      label.style.color = "white";
      label.style.padding = "10px";
      label.style.backgroundColor = "black";
      label.style.fontFamily = "sans-serif";
      label.style.top = `${(gridYFlipped + 0.1) * gridHeight}px`;
      label.style.left = `${(gridX + 0.1) * gridWidth}px`;
      document.body.appendChild(label);
    }
  };

  let prevMousePos = { x: 0, y: 0 };

  function loop() {
    animationTime++;
    hueOffset = hueOffset + 0.0001;
    if (stopLooping) return;
    const winDist = (userTopRight.x - userBottomLeft.x) / 12;
    if (
      Math.hypot(
        targetTopRight.x - userTopRight.x,
        targetTopRight.y - userTopRight.y
      ) < winDist &&
      Math.hypot(
        targetBottomLeft.x - userBottomLeft.x,
        targetTopRight.y - userTopRight.y
      ) < winDist &&
      !winAnimationRunning
    ) {
      winAnimationRunning = true;
      playSound("level-complete.flac", 1);
      levelsComplete.innerText =
        `${levelIndex + 1} / ${LEVELS.length}` +
        (levelIndex == LEVELS.length - 1 ? " | YOU WIN!" : "");
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

      let zoomAmount =
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
          ) -
        1;

      zoomAmount = Math.min(Math.max(zoomAmount, -0.1), 0.1);

      let originX = lerp(userBottomLeft.x, userTopRight.x, 0.5);
      let originY = lerp(userBottomLeft.y, userTopRight.y, 0.5);

      userBottomLeft.x = lerp(userBottomLeft.x, originX, zoomAmount);
      userBottomLeft.y = lerp(userBottomLeft.y, originY, zoomAmount);

      userTopRight.x = lerp(userTopRight.x, originX, zoomAmount);
      userTopRight.y = lerp(userTopRight.y, originY, zoomAmount);

      debugBox.innerText = `zoom: ${zoomAmount}, touchvalues: ${JSON.stringify(
        touchValues
      )}`;

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

    if (scrollUntilNoise < 0) {
      scrollUntilNoise = 1;
      playSound(
        "scroll-noise.flac",
        0.8 + 0.06 * Math.log2(1 / (userTopRight.x - userBottomLeft.x)),
        0.7
      );
    }
    scrollUntilNoise -= Math.abs(factor) * 3;

    let originX = lerp(userBottomLeft.x, userTopRight.x, 0.5);
    let originY = lerp(userBottomLeft.y, userTopRight.y, 0.5);

    userBottomLeft.x = lerp(userBottomLeft.x, originX, factor);
    userBottomLeft.y = lerp(userBottomLeft.y, originY, factor);

    userTopRight.x = lerp(userTopRight.x, originX, factor);
    userTopRight.y = lerp(userTopRight.y, originY, factor);

    prevMousePos = mousePos;

    draw(window.innerWidth, window.innerHeight, set);

    requestAnimationFrame(loop);
  }

  loop();
})();
