/**
 * Chaos Button - WebGL Shader Effect
 * Creates animated colorful lines inside a button using WebGL
 */

// Vertex shader - pass through UV coordinates
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader - creates animated noise lines
const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_tap;
  uniform float u_speed;
  uniform float u_amplitude;
  uniform float u_pulseMin;
  uniform float u_pulseMax;
  uniform float u_noiseType;

  // Trigonometric noise (smooth, periodic)
  float noiseTrig(vec2 p) {
    float x = p.x;
    float y = p.y;

    float n = sin(x * 1.0 + sin(y * 1.3)) * 0.5;
    n += sin(y * 1.0 + sin(x * 1.1)) * 0.5;
    n += sin((x + y) * 0.5) * 0.25;
    n += sin((x - y) * 0.7) * 0.25;

    return n * 0.5 + 0.5;
  }

  // Noise function
  float noise(vec2 p) {
    return noiseTrig(p);
  }

  // Fractional Brownian Motion
  float fbm(vec2 p, vec3 a) {
    float v = 0.0;
    v += noise(p * a.x) * 0.50;
    v += noise(p * a.y) * 1.50;
    v += noise(p * a.z) * 0.125 * 0.1;
    return v;
  }

  // Draw animated lines
  vec3 drawLines(vec2 uv, vec3 fbmOffset, vec3 color1, float secs) {
    float timeVal = secs * 0.1;
    vec3 finalColor = vec3(0.0);

    vec3 colorSets[4];
    colorSets[0] = vec3(0.7, 0.05, 1.0);   // Purple
    colorSets[1] = vec3(1.0, 0.19, 0.0);   // Orange
    colorSets[2] = vec3(0.0, 1.0, 0.3);    // Green
    colorSets[3] = vec3(0.0, 0.38, 1.0);   // Blue

    // First pass - base lines
    for(int i = 0; i < 4; i++) {
      float indexAsFloat = float(i);
      float amp = u_amplitude + (indexAsFloat * 0.0);
      float period = 2.0 + (indexAsFloat + 2.0);
      float thickness = mix(0.4, 0.2, noise(uv * 2.0));

      float t = abs(1.0 / (sin(uv.y + fbm(uv + timeVal * period, fbmOffset)) * amp) * thickness);

      finalColor += t * colorSets[i];
    }

    // Second pass - secondary lines
    for(int i = 0; i < 4; i++) {
      float indexAsFloat = float(i);
      float amp = (u_amplitude * 0.5) + (indexAsFloat * 5.0);
      float period = 9.0 + (indexAsFloat + 2.0);
      float thickness = mix(0.1, 0.1, noise(uv * 12.0));

      float t = abs(1.0 / (sin(uv.y + fbm(uv + timeVal * period, fbmOffset)) * amp) * thickness);

      finalColor += t * colorSets[i] * color1;
    }

    return finalColor;
  }

  void main() {
    // Normalize coordinates
    vec2 uv = (gl_FragCoord.xy / u_resolution.x) * 1.0 - 1.0;
    uv *= 1.5;

    vec3 lineColor1 = vec3(1.0, 0.0, 0.5);
    vec3 lineColor2 = vec3(0.3, 0.5, 1.5);

    float spread = abs(u_tap);

    // Blue background color (matching --accent: #3b82f6)
    vec3 bgColor = vec3(0.23, 0.51, 0.96);
    vec3 finalColor = bgColor * 0.3; // Darker blue base

    float t = sin(u_time) * 0.5 + 0.5;
    float pulse = mix(u_pulseMin, u_pulseMax, t);

    // Combine both line passes
    finalColor += drawLines(uv, vec3(65.2, 40.0, 4.0), lineColor1, u_time * u_speed) * pulse;
    finalColor += drawLines(uv, vec3(5.0 * spread / 2.0, 2.1 * spread, 1.0), lineColor2, u_time * u_speed);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

class ChaosButton {
  constructor(button, config) {
    this.button = button;
    this.canvas = button.querySelector('.chaos-canvas');
    if (!this.canvas) return;

    this.config = config;
    this.startTime = Date.now();
    this.lastTime = 0;
    this.phase = 0;

    // Current animated values
    this.currentSpeed = config.restingSpeed;
    this.currentAmplitude = config.restingAmplitude;
    this.currentPulseMin = config.restingPulseMin;
    this.currentPulseMax = config.restingPulseMax;
    this.currentTap = config.restingTap;

    this.setupWebGL();
    this.setupEvents();
    this.render();
  }

  setupWebGL() {
    const gl = this.canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    this.gl = gl;

    // Compile shaders
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    this.program = program;
    gl.useProgram(program);

    // Set up geometry (fullscreen quad)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    this.uniformLocations = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      tap: gl.getUniformLocation(program, 'u_tap'),
      speed: gl.getUniformLocation(program, 'u_speed'),
      amplitude: gl.getUniformLocation(program, 'u_amplitude'),
      pulseMin: gl.getUniformLocation(program, 'u_pulseMin'),
      pulseMax: gl.getUniformLocation(program, 'u_pulseMax'),
      noiseType: gl.getUniformLocation(program, 'u_noiseType'),
    };

    this.resize();
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = this.button.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(
      this.uniformLocations.resolution,
      this.canvas.width,
      this.canvas.height
    );
  }

  // Simple easing function
  easeOutPower2(t) {
    return 1 - Math.pow(1 - t, 2);
  }

  // Animate a value towards target
  animateValue(current, target, speed) {
    const diff = target - current;
    return current + diff * speed;
  }

  setupEvents() {
    let isActive = false;
    let animationProgress = 0;

    const activate = () => {
      isActive = true;
    };

    const deactivate = () => {
      isActive = false;
    };

    // Update animation in render loop
    this.updateAnimation = () => {
      const targetSpeed = isActive ? this.config.activeSpeed : this.config.restingSpeed;
      const targetAmplitude = isActive ? this.config.activeAmplitude : this.config.restingAmplitude;
      const targetPulseMin = isActive ? this.config.activePulseMin : this.config.restingPulseMin;
      const targetPulseMax = isActive ? this.config.activePulseMax : this.config.restingPulseMax;
      const targetTap = isActive ? this.config.activeTap : this.config.restingTap;

      const lerpSpeed = isActive ? 0.15 : 0.03;

      this.currentSpeed = this.animateValue(this.currentSpeed, targetSpeed, lerpSpeed);
      this.currentAmplitude = this.animateValue(this.currentAmplitude, targetAmplitude, lerpSpeed);
      this.currentPulseMin = this.animateValue(this.currentPulseMin, targetPulseMin, lerpSpeed);
      this.currentPulseMax = this.animateValue(this.currentPulseMax, targetPulseMax, lerpSpeed);
      this.currentTap = this.animateValue(this.currentTap, targetTap, lerpSpeed);
    };

    // Trigger on hover instead of press
    this.button.addEventListener('mouseenter', activate);
    this.button.addEventListener('mouseleave', deactivate);
    this.button.addEventListener('touchstart', activate);
    this.button.addEventListener('touchend', deactivate);

    window.addEventListener('resize', () => this.resize());
  }

  render = () => {
    if (!this.gl) return;

    const time = (Date.now() - this.startTime) / 1000;
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    // Update animation values
    if (this.updateAnimation) {
      this.updateAnimation();
    }

    // Accumulate phase smoothly based on current speed
    this.phase += deltaTime * this.currentSpeed;

    // Wrap phase to prevent drift
    if (this.phase > 1000) {
      this.phase = this.phase % 1000;
    }

    this.gl.uniform1f(this.uniformLocations.time, this.phase);
    this.gl.uniform1f(this.uniformLocations.tap, this.currentTap);
    this.gl.uniform1f(this.uniformLocations.speed, 1.0);
    this.gl.uniform1f(this.uniformLocations.amplitude, this.currentAmplitude);
    this.gl.uniform1f(this.uniformLocations.pulseMin, this.currentPulseMin);
    this.gl.uniform1f(this.uniformLocations.pulseMax, this.currentPulseMax);
    this.gl.uniform1f(this.uniformLocations.noiseType, 1.0); // Trig noise

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(this.render);
  };
}

// Configuration
const chaosConfig = {
  // Resting state (idle)
  restingSpeed: 0.35,
  restingAmplitude: 80,
  restingPulseMin: 0.05,
  restingPulseMax: 0.2,
  restingTap: 1.0,
  // Active state (pressed)
  activeSpeed: 2.8,
  activeAmplitude: 10,
  activePulseMin: 0.05,
  activePulseMax: 0.4,
  activeTap: 1.0,
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const chaosButtons = document.querySelectorAll('.chaos-button');
  chaosButtons.forEach(button => {
    new ChaosButton(button, chaosConfig);
  });
});
