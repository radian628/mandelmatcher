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
        x: -1.567237808935025,
        y: -0.5634295039781368
      },
      topRight: {
        x: -0.4635249284236504,
        y: 0.540283376533235
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.7167493837524495,
        y: 0.40506130306021365
      },
      topRight: {
        x: -0.3224314822733099,
        y: 0.7993792045393522
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.21373789725275888,
        y: -0.08591326357228113
      },
      topRight: {
        x: 0.37552217091227036,
        y: 0.0758710100872297
      },
      fractalIndex: 1,
      params: {
        x: -0.3436385255648038,
        y: -0.004282655246252709
      }
    },
    {
      bottomLeft: {
        x: -1.8968619993813423,
        y: -0.13524676606496094
      },
      topRight: {
        x: -1.6253906671956728,
        y: 0.1362245661207094
      },
      fractalIndex: 1,
      params: {
        x: -0.3436385255648038,
        y: -0.004282655246252709
      }
    },
    // add some more levels here between zoom levels 4 and 14
    {
      bottomLeft: {
        x: 0.047514078338310714,
        y: 0.5813964071711524
      },
      topRight: {
        x: 0.22281609140514436,
        y: 0.7566984202379872
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -1.5308643358316392,
        y: -0.25933954441185697
      },
      topRight: {
        x: -1.320939534620107,
        y: -0.049414743200325115
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.3267041411059802,
        y: 0.5797128874572623
      },
      topRight: {
        x: 0.4374003189766384,
        y: 0.6904090653279197
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.7312708839988104,
        y: -0.509526368359592
      },
      topRight: {
        x: -0.6430550187428722,
        y: -0.42131050310364987
      },
      fractalIndex: 1,
      params: {
        x: -0.16057585825027687,
        y: 0.20342612419700212
      }
    },
    // harder stuff
    {
      bottomLeft: {
        x: -0.29217933711418237,
        y: 0.8075503227659846
      },
      topRight: {
        x: -0.21715530646090014,
        y: 0.8825743534192677
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.6091914677639261,
        y: -0.6826542138250117
      },
      topRight: {
        x: -0.5381912220238967,
        y: -0.6116539680935971
      },
      fractalIndex: 1,
      params: {
        x: -0.20332936979785965,
        y: -0.31049250535331907
      }
    },
    {
      bottomLeft: {
        x: 0.3269114127814559,
        y: 0.6148588972516744
      },
      topRight: {
        x: 0.38587313000551615,
        y: 0.6738206144757348
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.761522302414126,
        y: 0.18329183413934488
      },
      topRight: {
        x: -0.7113791956054126,
        y: 0.23343494094805375
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.9479219885015935,
        y: -0.3097326614583672
      },
      topRight: {
        x: -0.9108836237290072,
        y: -0.27269429668578415
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.1614078112917602,
        y: -0.6094354894280556
      },
      topRight: {
        x: 0.20347496263492398,
        y: -0.5673683380848925
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.8375141320941696,
        y: 0.22917754201213877
      },
      topRight: {
        x: -0.8249876431805833,
        y: 0.24170403092572515
      },
      fractalIndex: 1,
      params: {
        x: 0.34883720930232553,
        y: -0.25267665952890794
      }
    },
    {
      bottomLeft: {
        x: -1.767772771788433,
        y: 0.011721642294182776
      },
      topRight: {
        x: -1.7582273846389225,
        y: 0.02126702944369282
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.20039358578346736,
        y: 1.0982350414761437
      },
      topRight: {
        x: -0.1963110863991057,
        y: 1.102317540860506
      },
      fractalIndex: 1,
      params: {
        x: -0.01218161683277963,
        y: 0.008565310492505418
      }
    }
    // {
    //   bottomLeft: {
    //     x: -0.302373124875951,
    //     y: -1.0315392869672173,
    //   },
    //   topRight: {
    //     x: 0.4567576185848055,
    //     y: -0.2724085435064655,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
    // {
    //   bottomLeft: {
    //     x: -1.0808099909819329,
    //     y: -0.5385742813352624,
    //   },
    //   topRight: {
    //     x: -0.684866200062996,
    //     y: -0.14263049041632594,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
    // {
    //   bottomLeft: {
    //     x: -1.2629528160529173,
    //     y: 0.3745317849422254,
    //   },
    //   topRight: {
    //     x: -1.2485148474591334,
    //     y: 0.38896975353601,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
    // {
    //   bottomLeft: {
    //     x: 0.34708677390673875,
    //     y: 0.5729895209222156,
    //   },
    //   topRight: {
    //     x: 0.38386464665796144,
    //     y: 0.6097673936734397,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
    // {
    //   bottomLeft: {
    //     x: -1.8667391911660034,
    //     y: -0.0056043732637976965,
    //   },
    //   topRight: {
    //     x: -1.8557129943785577,
    //     y: 0.005421823523647911,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
  ];

  // src/sound.ts
  var ac = new AudioContext();
  var soundCache = /* @__PURE__ */ new Map();
  async function fetchAudio(url) {
    let audio = soundCache.get(url);
    if (!audio) {
      const file = await fetch(url);
      const buf = await file.arrayBuffer();
      audio = await ac.decodeAudioData(buf);
      soundCache.set(url, audio);
    }
    return audio;
  }
  async function createSoundWithPitchAndGain(audio, pitch, gain) {
    const track = new AudioBufferSourceNode(ac, {
      buffer: audio,
      playbackRate: pitch
    });
    const gainNode = new GainNode(ac, {
      gain: gain ?? 1
    });
    track.connect(gainNode);
    gainNode.connect(ac.destination);
    return track;
  }
  async function playSound(url, pitch, gain) {
    const track = await createSoundWithPitchAndGain(
      await fetchAudio(url),
      pitch,
      gain
    );
    track.start();
    return track;
  }
  async function loopSound(url, pitch, gain) {
    const audio = await fetchAudio(url);
    const track = await createSoundWithPitchAndGain(audio, pitch, gain);
    track.loop = true;
    track.start();
    return track;
  }

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
  canvas.addEventListener("mousemove", (e) => {
    mousePos = { x: e.clientX, y: e.clientY };
  });
  var isMusicPlayingYet = false;
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
  var fine = false;
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
  var touches = /* @__PURE__ */ new Map();
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
          dy: t.clientY - oldTouch.y + oldTouch.dy
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
  var lastScrollPositive = 2 /* None */;
  var scrollUntilNoise = 0;
  canvas.addEventListener("wheel", (e) => {
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
      params: { ...userTargetParams }
    });
  }
  function loadLevel(level) {
    targetBottomLeft = { ...level.bottomLeft };
    targetTopRight = { ...level.topRight };
    targetParams = { ...level.params };
  }
  loadLevel(LEVELS[0]);
  window.printParams = printParams;
  window.printZoomLevels = () => {
    return LEVELS.map((l) => Math.round(1 / (l.topRight.x - l.bottomLeft.x)));
  };
  function draw(w, h, set) {
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
    set("1f", "threshold", 4);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  var matchFound = document.getElementById("match-found");
  var levelsComplete = document.getElementById("levels-complete");
  var info = document.getElementById("info");
  var debugBox = document.getElementById("debug");
  var startButton = document.getElementById("start");
  startButton.addEventListener("click", (e) => {
    info.style.display = "none";
  });
  var hueOffset = -0.1;
  var animationTime = 0;
  (async () => {
    const set = await setupGL();
    let stopLooping = false;
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
      hueOffset = hueOffset + 1e-4;
      if (stopLooping) return;
      const winDist = (userTopRight.x - userBottomLeft.x) / 12;
      if (Math.hypot(
        targetTopRight.x - userTopRight.x,
        targetTopRight.y - userTopRight.y
      ) < winDist && Math.hypot(
        targetBottomLeft.x - userBottomLeft.x,
        targetTopRight.y - userTopRight.y
      ) < winDist && !winAnimationRunning) {
        winAnimationRunning = true;
        playSound("level-complete.flac", 1);
        levelsComplete.innerText = `${levelIndex + 1} / ${LEVELS.length}` + (levelIndex == LEVELS.length - 1 ? " | YOU WIN!" : "");
      }
      if (winAnimationRunning) {
        winAnimationFrame++;
      }
      if (winAnimationFrame > 0 && winAnimationFrame < 120) {
        userBottomLeft = {
          x: lerp(userBottomLeft.x, targetBottomLeft.x, 0.1),
          y: lerp(userBottomLeft.y, targetBottomLeft.y, 0.1)
        };
        userTopRight = {
          x: lerp(userTopRight.x, targetTopRight.x, 0.1),
          y: lerp(userTopRight.y, targetTopRight.y, 0.1)
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
        let deltaX = -(touchValues[0].dx / window.innerHeight) * (userTopRight.y - userBottomLeft.y);
        let deltaY = touchValues[0].dy / window.innerHeight * (userTopRight.y - userBottomLeft.y);
        userBottomLeft.x += deltaX;
        userBottomLeft.y += deltaY;
        userTopRight.x += deltaX;
        userTopRight.y += deltaY;
        touchValues[0].dx = 0;
        touchValues[0].dy = 0;
      } else if (touchValues.length === 2) {
        let deltaX = -((touchValues[0].dx + touchValues[1].dx) / 2 / window.innerHeight) * (userTopRight.y - userBottomLeft.y);
        let deltaY = (touchValues[0].dy + touchValues[1].dy) / 2 / window.innerHeight * (userTopRight.y - userBottomLeft.y);
        userBottomLeft.x += deltaX;
        userBottomLeft.y += deltaY;
        userTopRight.x += deltaX;
        userTopRight.y += deltaY;
        let zoomAmount = Math.hypot(
          touchValues[0].x - touchValues[1].x,
          touchValues[0].y - touchValues[1].y
        ) / Math.hypot(
          touchValues[0].x - touchValues[0].dx - touchValues[1].x + touchValues[1].dx,
          touchValues[0].y - touchValues[0].dy - touchValues[1].y + touchValues[1].dy
        ) - 1;
        zoomAmount = Math.min(Math.max(zoomAmount, -0.1), 0.1);
        let originX2 = lerp(userBottomLeft.x, userTopRight.x, 0.5);
        let originY2 = lerp(userBottomLeft.y, userTopRight.y, 0.5);
        userBottomLeft.x = lerp(userBottomLeft.x, originX2, zoomAmount);
        userBottomLeft.y = lerp(userBottomLeft.y, originY2, zoomAmount);
        userTopRight.x = lerp(userTopRight.x, originX2, zoomAmount);
        userTopRight.y = lerp(userTopRight.y, originY2, zoomAmount);
        debugBox.innerText = `zoom: ${zoomAmount}, touchvalues: ${JSON.stringify(
          touchValues
        )}`;
        touchValues[0].dx = 0;
        touchValues[0].dy = 0;
        touchValues[1].dx = 0;
        touchValues[1].dy = 0;
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
        scrollVel += fine ? 5e-3 : 0.03;
      } else if (lastScrollPositive === 0 /* Negative */) {
        scrollVel -= fine ? 5e-3 : 0.03;
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
})();
//# sourceMappingURL=index.js.map
