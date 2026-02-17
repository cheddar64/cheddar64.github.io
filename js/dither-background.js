/**
 * Dither Background Effect
 * Vanilla JS/WebGL implementation of animated dithered waves
 */

class DitherBackground {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      waveColor: options.waveColor || [0, 0.165, 1],
      waveSpeed: options.waveSpeed || 0.01,
      waveFrequency: options.waveFrequency || 8.5,
      waveAmplitude: options.waveAmplitude || 0.4,
      waveDirection: options.waveDirection || [1, 1],
      colorNum: options.colorNum || 5,
      pixelSize: options.pixelSize || 4,
      ...options
    };

    this.time = 0;
    this.animationId = null;

    if (this.init()) {
      this.animate();
    }
  }

  init() {
    const gl = this.canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: false
    });

    if (!gl) {
      console.error('WebGL not supported');
      return false;
    }

    this.gl = gl;

    // Create combined shader program (wave + dither in one pass)
    this.program = this.createProgram(vertexShader, fragmentShader);
    if (!this.program) return false;

    // Set up geometry
    this.setupGeometry();

    // Get uniform locations
    this.uniforms = {
      resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      time: gl.getUniformLocation(this.program, 'u_time'),
      waveSpeed: gl.getUniformLocation(this.program, 'u_waveSpeed'),
      waveFrequency: gl.getUniformLocation(this.program, 'u_waveFrequency'),
      waveAmplitude: gl.getUniformLocation(this.program, 'u_waveAmplitude'),
      waveDirection: gl.getUniformLocation(this.program, 'u_waveDirection'),
      waveColor: gl.getUniformLocation(this.program, 'u_waveColor'),
      colorNum: gl.getUniformLocation(this.program, 'u_colorNum'),
      pixelSize: gl.getUniformLocation(this.program, 'u_pixelSize')
    };

    // Initial resize
    this.resize();

    // Debounce resize for performance
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 100);
    };

    window.addEventListener('resize', debouncedResize);

    // Handle mobile viewport changes (Safari URL bar, keyboard, pinch-zoom, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', debouncedResize);
      window.visualViewport.addEventListener('scroll', debouncedResize);
    }

    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', () => {
      // Delay to let orientation change complete
      setTimeout(() => this.resize(), 200);
    });

    return true;
  }

  createShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createProgram(vertexSource, fragmentSource) {
    const gl = this.gl;
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  setupGeometry() {
    const gl = this.gl;
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  }

  resize() {
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio, 1.5);

    // Use visualViewport for better mobile support (handles Safari URL bar)
    const vv = window.visualViewport;
    const viewWidth = vv ? vv.width : window.innerWidth;
    const viewHeight = vv ? vv.height : window.innerHeight;

    // Use the larger of viewport dimensions, document dimensions, or screen dimensions
    // This ensures coverage even when zoomed out on mobile
    const baseWidth = Math.max(
      viewWidth,
      document.documentElement.clientWidth,
      window.screen.width
    );
    const baseHeight = Math.max(
      viewHeight,
      document.documentElement.clientHeight,
      window.screen.height
    );

    // Add 20% extra to ensure full coverage during zoom operations (matches CSS 120vw/120vh)
    const width = Math.floor(baseWidth * 1.2 * dpr);
    const height = Math.floor(baseHeight * 1.2 * dpr);

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  render() {
    const gl = this.gl;
    const opts = this.options;

    gl.useProgram(this.program);

    // Set uniforms
    gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms.time, this.time);
    gl.uniform1f(this.uniforms.waveSpeed, opts.waveSpeed);
    gl.uniform1f(this.uniforms.waveFrequency, opts.waveFrequency);
    gl.uniform1f(this.uniforms.waveAmplitude, opts.waveAmplitude);
    gl.uniform2fv(this.uniforms.waveDirection, opts.waveDirection);
    gl.uniform3fv(this.uniforms.waveColor, opts.waveColor);
    gl.uniform1f(this.uniforms.colorNum, opts.colorNum);
    gl.uniform1f(this.uniforms.pixelSize, opts.pixelSize);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  animate = () => {
    this.time += 0.016;
    this.render();
    this.animationId = requestAnimationFrame(this.animate);
  };

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// === COMBINED SHADER (Wave + Dither in one pass) ===

const vertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_waveSpeed;
uniform float u_waveFrequency;
uniform float u_waveAmplitude;
uniform vec3 u_waveColor;
uniform float u_colorNum;
uniform float u_pixelSize;

// Perlin noise functions
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

// Fractional Brownian Motion
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = u_waveFrequency;
  for (int i = 0; i < 4; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= u_waveAmplitude;
  }
  return value;
}

uniform vec2 u_waveDirection;

float pattern(vec2 p) {
  vec2 p2 = p - u_time * u_waveSpeed * u_waveDirection;
  return fbm(p + fbm(p2));
}

// Bayer 8x8 dithering
float getBayer(int x, int y) {
  int index = y * 8 + x;

  // Bayer matrix values
  if (index == 0) return 0.0/64.0;
  if (index == 1) return 48.0/64.0;
  if (index == 2) return 12.0/64.0;
  if (index == 3) return 60.0/64.0;
  if (index == 4) return 3.0/64.0;
  if (index == 5) return 51.0/64.0;
  if (index == 6) return 15.0/64.0;
  if (index == 7) return 63.0/64.0;

  if (index == 8) return 32.0/64.0;
  if (index == 9) return 16.0/64.0;
  if (index == 10) return 44.0/64.0;
  if (index == 11) return 28.0/64.0;
  if (index == 12) return 35.0/64.0;
  if (index == 13) return 19.0/64.0;
  if (index == 14) return 47.0/64.0;
  if (index == 15) return 31.0/64.0;

  if (index == 16) return 8.0/64.0;
  if (index == 17) return 56.0/64.0;
  if (index == 18) return 4.0/64.0;
  if (index == 19) return 52.0/64.0;
  if (index == 20) return 11.0/64.0;
  if (index == 21) return 59.0/64.0;
  if (index == 22) return 7.0/64.0;
  if (index == 23) return 55.0/64.0;

  if (index == 24) return 40.0/64.0;
  if (index == 25) return 24.0/64.0;
  if (index == 26) return 36.0/64.0;
  if (index == 27) return 20.0/64.0;
  if (index == 28) return 43.0/64.0;
  if (index == 29) return 27.0/64.0;
  if (index == 30) return 39.0/64.0;
  if (index == 31) return 23.0/64.0;

  if (index == 32) return 2.0/64.0;
  if (index == 33) return 50.0/64.0;
  if (index == 34) return 14.0/64.0;
  if (index == 35) return 62.0/64.0;
  if (index == 36) return 1.0/64.0;
  if (index == 37) return 49.0/64.0;
  if (index == 38) return 13.0/64.0;
  if (index == 39) return 61.0/64.0;

  if (index == 40) return 34.0/64.0;
  if (index == 41) return 18.0/64.0;
  if (index == 42) return 46.0/64.0;
  if (index == 43) return 30.0/64.0;
  if (index == 44) return 33.0/64.0;
  if (index == 45) return 17.0/64.0;
  if (index == 46) return 45.0/64.0;
  if (index == 47) return 29.0/64.0;

  if (index == 48) return 10.0/64.0;
  if (index == 49) return 58.0/64.0;
  if (index == 50) return 6.0/64.0;
  if (index == 51) return 54.0/64.0;
  if (index == 52) return 9.0/64.0;
  if (index == 53) return 57.0/64.0;
  if (index == 54) return 5.0/64.0;
  if (index == 55) return 53.0/64.0;

  if (index == 56) return 42.0/64.0;
  if (index == 57) return 26.0/64.0;
  if (index == 58) return 38.0/64.0;
  if (index == 59) return 22.0/64.0;
  if (index == 60) return 41.0/64.0;
  if (index == 61) return 25.0/64.0;
  if (index == 62) return 37.0/64.0;

  return 21.0/64.0;
}

vec3 dither(vec2 fragCoord, vec3 color) {
  vec2 scaledCoord = floor(fragCoord / u_pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));

  float threshold = getBayer(x, y) - 0.25;
  float step = 1.0 / (u_colorNum - 1.0);

  color += threshold * step;
  color = clamp(color - 0.2, 0.0, 1.0);

  return floor(color * (u_colorNum - 1.0) + 0.5) / (u_colorNum - 1.0);
}

void main() {
  // Pixelate the coordinates
  vec2 pixelCoord = floor(gl_FragCoord.xy / u_pixelSize) * u_pixelSize;

  // Normalize UV
  vec2 uv = pixelCoord / u_resolution.xy;
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;

  // Generate wave pattern
  float f = pattern(uv);
  vec3 color = mix(vec3(0.0), u_waveColor, f);

  // Apply dithering
  color = dither(gl_FragCoord.xy, color);

  gl_FragColor = vec4(color, 1.0);
}
`;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('dither-background');
  if (canvas) {
    // Read direction from data attribute (default: 1,1)
    const dirAttr = canvas.dataset.direction || '1,1';
    const direction = dirAttr.split(',').map(Number);

    new DitherBackground(canvas, {
      waveColor: [0.8, 0.8, 0.8],
      waveSpeed: 0.01,
      waveFrequency: 8.5,
      waveAmplitude: 0.4,
      waveDirection: direction,
      colorNum: 5,
      pixelSize: 4
    });
  }
});
