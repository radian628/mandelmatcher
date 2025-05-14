(() => {
  // src/gl-lib.ts
  function createShader(gl2, source, type) {
    const shader = gl2.createShader(type);
    if (!shader) return void 0;
    gl2.shaderSource(shader, source);
    gl2.compileShader(shader);
    if (!gl2.getShaderParameter(shader, gl2.COMPILE_STATUS)) {
      console.log(gl2.getShaderInfoLog(shader));
      return;
    }
    return shader;
  }
  function createProgram(gl2, vertex, fragment) {
    const prog = gl2.createProgram();
    if (!prog) return void 0;
    gl2.attachShader(prog, vertex);
    gl2.attachShader(prog, fragment);
    gl2.linkProgram(prog);
    if (!gl2.getProgramParameter(prog, gl2.LINK_STATUS)) {
      gl2.getProgramInfoLog(prog);
      return void 0;
    }
    return prog;
  }
  function createProgramFromShaderSources(gl2, vertex, fragment) {
    const maybeVShader = createShader(gl2, vertex, gl2.VERTEX_SHADER);
    const maybeFShader = createShader(gl2, fragment, gl2.FRAGMENT_SHADER);
    if (!maybeVShader || !maybeFShader) return void 0;
    return createProgram(gl2, maybeVShader, maybeFShader);
  }
  function makeUniformSetter(gl2, prog) {
    return (type, name, ...data) => {
      gl2["uniform" + type](gl2.getUniformLocation(prog, name), ...data);
    };
  }
  var FULLSCREEN_QUAD = new Float32Array([
    -1,
    1,
    1,
    1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    -1,
    -1
  ]);

  // src/levels.ts
  var LEVELS = [
    {
      bottomLeft: {
        x: -0.302373124875951,
        y: -1.0315392869672173
      },
      topRight: {
        x: 0.4567576185848055,
        y: -0.2724085435064655
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -1.0808099909819329,
        y: -0.5385742813352624
      },
      topRight: {
        x: -0.684866200062996,
        y: -0.14263049041632594
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -1.2629528160529173,
        y: 0.3745317849422254
      },
      topRight: {
        x: -1.2485148474591334,
        y: 0.38896975353601
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.34708677390673875,
        y: 0.5729895209222156
      },
      topRight: {
        x: 0.38386464665796144,
        y: 0.6097673936734397
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -1.8667391911660034,
        y: -0.0056043732637976965
      },
      topRight: {
        x: -1.8557129943785577,
        y: 0.005421823523647911
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    }
  ];

  // src/index.ts
  var canvas = document.getElementById(
    "canvas"
  );
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener("resize", resize);
  var gl = canvas.getContext("webgl2");
  resize();
  async function setupGL() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    const vertexSource = await (await fetch("./fractal.vert")).text();
    const fragmentSource = await (await fetch("./fractal.frag")).text();
    const prog = createProgramFromShaderSources(gl, vertexSource, fragmentSource);
    if (!prog) {
      return;
    }
    const set = makeUniformSetter(gl, prog);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const fullscreenQuadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenQuadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD, gl.STATIC_DRAW);
    gl.useProgram(prog);
    const vertexPositionLocation = gl.getAttribLocation(prog, "vertex_position");
    gl.enableVertexAttribArray(vertexPositionLocation);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 8, 0);
    return set;
  }
  var mousePos = { x: 0, y: 0 };
  var mouseButtonsPressed = /* @__PURE__ */ new Map();
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
  var fine = false;
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
  var lastScrollPositive = 2 /* None */;
  document.addEventListener("wheel", (e) => {
    lastScrollPositive = e.deltaY > 0 ? 1 /* Positive */ : 0 /* Negative */;
  });
  var userBottomLeft = { x: -2, y: -2 };
  var userTopRight = { x: 2, y: 2 };
  var userParams = { x: 0.2, y: -0.6 };
  var userTargetParams = { x: 0.2, y: -0.6 };
  var scrollVel = 0;
  var fractalIndex = 1;
  var levelIndex = 0;
  var targetBottomLeft = { x: 0, y: 0 };
  var targetTopRight = { x: 0, y: 0 };
  var targetParams = { x: 0, y: 0 };
  var winAnimationFrame = 0;
  var winAnimationRunning = false;
  function lerp(a, b, x) {
    return b * x + a * (1 - x);
  }
  function printParams() {
    console.log({
      bottomLeft: { ...userBottomLeft },
      topRight: { ...userTopRight },
      fractalIndex,
      params: { ...userTargetParams }
    });
  }
  var fractalsMatched = document.getElementById("fractals-matched");
  function loadLevel(level) {
    targetBottomLeft = { ...level.bottomLeft };
    targetTopRight = { ...level.topRight };
    targetParams = { ...level.params };
    fractalsMatched.innerText = `Fractals Matched ${levelIndex}/${LEVELS.length}`;
  }
  loadLevel(LEVELS[0]);
  window.printParams = printParams;
  var matchFound = document.getElementById("match-found");
  (async () => {
    const set = await setupGL();
    let prevMousePos = { x: 0, y: 0 };
    function loop() {
      const winDist = (userTopRight.x - userBottomLeft.x) / 50;
      if (Math.hypot(
        targetTopRight.x - userTopRight.x,
        targetTopRight.y - userTopRight.y
      ) < winDist && Math.hypot(
        targetBottomLeft.x - userBottomLeft.x,
        targetTopRight.y - userTopRight.y
      ) < winDist) {
        winAnimationRunning = true;
      }
      if (winAnimationRunning) {
        winAnimationFrame++;
      }
      matchFound.style.opacity = (1 - Math.min(Math.max(Math.abs(winAnimationFrame - 120) / 60 - 1, 0), 1)).toString();
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
      if (mouseButtonsPressed.get(0)) {
        let deltaX = (prevMousePos.x - mousePos.x) / window.innerHeight * (userTopRight.y - userBottomLeft.y);
        let deltaY = (mousePos.y - prevMousePos.y) / window.innerHeight * (userTopRight.y - userBottomLeft.y);
        userBottomLeft.x += deltaX;
        userBottomLeft.y += deltaY;
        userTopRight.x += deltaX;
        userTopRight.y += deltaY;
      }
      if (mouseButtonsPressed.get(2)) {
        userTargetParams.x = mousePos.x / window.innerWidth * 2 - 1;
        userTargetParams.y = mousePos.y / window.innerHeight * 2 - 1;
      }
      userParams = {
        x: lerp(userParams.x, userTargetParams.x, 0.3),
        y: lerp(userParams.y, userTargetParams.y, 0.3)
      };
      if (lastScrollPositive === 1 /* Positive */) {
        scrollVel += fine ? 5e-3 : 0.06;
      } else if (lastScrollPositive === 0 /* Negative */) {
        scrollVel -= fine ? 5e-3 : 0.06;
      }
      scrollVel *= 0.75;
      lastScrollPositive = 2 /* None */;
      let factor = scrollVel;
      if (userTopRight.x - userBottomLeft.x > 10) {
        factor = Math.max(factor, 0);
      }
      if (userTopRight.x - userBottomLeft.x < 1e-7) {
        factor = Math.min(factor, 0);
      }
      let originX = lerp(userBottomLeft.x, userTopRight.x, 0.5);
      let originY = lerp(userBottomLeft.y, userTopRight.y, 0.5);
      userBottomLeft.x = lerp(userBottomLeft.x, originX, factor);
      userBottomLeft.y = lerp(userBottomLeft.y, originY, factor);
      userTopRight.x = lerp(userTopRight.x, originX, factor);
      userTopRight.y = lerp(userTopRight.y, originY, factor);
      prevMousePos = mousePos;
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
          lerp(
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
})();
//# sourceMappingURL=index.js.map
