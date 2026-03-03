import * as THREE from 'three';

// Depth colors
const DEPTH_COLORS = {
  skim:  new THREE.Color('#F6E05E'),
  scan:  new THREE.Color('#FC8181'),
  dig:   new THREE.Color('#63B3ED'),
  drill: new THREE.Color('#B794F4'),
  siege: new THREE.Color('#F687B3'),
};

// Council colors
const COUNCIL_COLORS = [
  new THREE.Color('#2B6CB0'), // synthesizer
  new THREE.Color('#C53030'), // contrarian
  new THREE.Color('#D69E2E'), // lateral
  new THREE.Color('#2F855A'), // source
  new THREE.Color('#6B46C1'), // pattern
  new THREE.Color('#9B2C2C'), // blind
  new THREE.Color('#38A169'), // temporal
];

const CONVERGENCE_COLOR = new THREE.Color('#63B3ED');
const BASE_COLOR = new THREE.Color('#4A5568');

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.scrollProgress = 0;
    this.isMobile = window.innerWidth < 768;
    this.count = this.isMobile ? 2000 : 6000;
    this.mouseX = 0;
    this.mouseY = 0;

    this._initRenderer();
    this._initScene();
    this._initParticles();
    this._initMouse();
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 30;
  }

  _initScene() {
    this.scene = new THREE.Scene();
  }

  _initParticles() {
    const count = this.count;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count * 3); // for varied motion
    const phases = new Float32Array(count); // which depth group

    // Initial scattered positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Scatter across viewport
      positions[i3]     = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      // Base gray color
      colors[i3]     = BASE_COLOR.r;
      colors[i3 + 1] = BASE_COLOR.g;
      colors[i3 + 2] = BASE_COLOR.b;

      // Random sizes
      sizes[i] = Math.random() * 2.0 + 0.5;

      // Random offsets for organic motion
      randoms[i3]     = Math.random() * Math.PI * 2;
      randoms[i3 + 1] = Math.random() * Math.PI * 2;
      randoms[i3 + 2] = Math.random() * 0.5 + 0.5;

      // Assign to depth group (0-4)
      phases[i] = Math.floor(Math.random() * 5);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Store originals for interpolation
    this.originalPositions = new Float32Array(positions);
    this.randoms = randoms;
    this.phases = phases;

    // Pre-compute target positions for each phase
    this._computeTargets();

    // Shader material for particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;

        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (20.0 / -mvPosition.z);
          gl_PointSize = max(gl_PointSize, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  _computeTargets() {
    const count = this.count;
    const depthKeys = ['skim', 'scan', 'dig', 'drill', 'siege'];

    // Phase: Pipeline (5 colored streams flowing right)
    this.pipelineTargets = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = this.phases[i];
      const streamY = (phase - 2) * 4; // -8, -4, 0, 4, 8
      const streamX = (Math.random() - 0.5) * 30;
      const streamZ = (Math.random() - 0.5) * 3;
      this.pipelineTargets[i3]     = streamX;
      this.pipelineTargets[i3 + 1] = streamY + (Math.random() - 0.5) * 1.5;
      this.pipelineTargets[i3 + 2] = streamZ;
    }

    // Phase: Council (7 orbits)
    this.councilTargets = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const councilIdx = i % 7;
      const radius = 8 + councilIdx * 1.5;
      const angle = (i / count) * Math.PI * 2 * 3 + councilIdx * 0.9;
      this.councilTargets[i3]     = Math.cos(angle) * radius;
      this.councilTargets[i3 + 1] = Math.sin(angle) * radius * 0.6;
      this.councilTargets[i3 + 2] = Math.sin(angle * 0.5) * 3;
    }

    // Phase: Research funnel (converging)
    this.researchTargets = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = i / count;
      const funnelX = (Math.random() - 0.5) * (1 - t) * 20;
      const funnelY = (t - 0.5) * 30;
      const funnelZ = (Math.random() - 0.5) * (1 - t) * 10;
      this.researchTargets[i3]     = funnelX;
      this.researchTargets[i3 + 1] = funnelY;
      this.researchTargets[i3 + 2] = funnelZ;
    }

    // Phase: Convergence (tight cluster)
    this.convergenceTargets = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      this.convergenceTargets[i3]     = r * Math.sin(phi) * Math.cos(theta);
      this.convergenceTargets[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      this.convergenceTargets[i3 + 2] = r * Math.cos(phi);
    }
  }

  _initMouse() {
    if (this.isMobile) return;
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  // scrollProgress: 0-1 over entire page
  setScrollProgress(progress) {
    this.scrollProgress = progress;
  }

  update(time) {
    if (!this.particles) return;

    const positions = this.particles.geometry.attributes.position.array;
    const colors = this.particles.geometry.attributes.color.array;
    const count = this.count;
    const p = this.scrollProgress;
    const depthKeys = ['skim', 'scan', 'dig', 'drill', 'siege'];

    // Determine which visual phase we're in based on scroll
    // 0.00 - 0.10: chaos (hero)
    // 0.10 - 0.20: problem (still chaos, but starting to stir)
    // 0.20 - 0.40: pipeline streams
    // 0.40 - 0.55: council orbits
    // 0.55 - 0.70: research funnel
    // 0.70 - 0.85: convergence
    // 0.85 - 1.00: tight point (install)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = this.phases[i];
      const rx = this.randoms[i3];
      const ry = this.randoms[i3 + 1];
      const rz = this.randoms[i3 + 2];

      let targetX, targetY, targetZ;
      let r = BASE_COLOR.r, g = BASE_COLOR.g, b = BASE_COLOR.b;

      if (p < 0.15) {
        // Chaos: scattered drift with visible downward current
        const drift = time * 0.0003 * rz;
        // Gentle downstream flow — wraps particles back to top when they drift below
        const currentSpeed = 0.0004 * rz;
        const yRange = 40; // matches original scatter range
        const rawY = this.originalPositions[i3 + 1] - (time * currentSpeed) % yRange;
        const wrappedY = ((rawY + yRange * 0.5) % yRange + yRange) % yRange - yRange * 0.5;

        targetX = this.originalPositions[i3] + Math.sin(drift + rx) * 2;
        targetY = wrappedY + Math.cos(drift + ry) * 0.8;
        targetZ = this.originalPositions[i3 + 2] + Math.sin(drift * 0.7) * 1;

        // Subtle color hint as we approach pipeline
        if (p > 0.08) {
          const colorT = (p - 0.08) / 0.07;
          const depthColor = DEPTH_COLORS[depthKeys[phase]];
          r = THREE.MathUtils.lerp(BASE_COLOR.r, depthColor.r, colorT * 0.3);
          g = THREE.MathUtils.lerp(BASE_COLOR.g, depthColor.g, colorT * 0.3);
          b = THREE.MathUtils.lerp(BASE_COLOR.b, depthColor.b, colorT * 0.3);
        }
      } else if (p < 0.35) {
        // Pipeline: flow into 5 streams
        const t = Math.min((p - 0.15) / 0.15, 1);
        const eased = t * t * (3 - 2 * t); // smoothstep

        const drift = time * 0.0005 * rz;
        const chaosX = this.originalPositions[i3] + Math.sin(drift + rx) * 2;
        const chaosY = this.originalPositions[i3 + 1] + Math.cos(drift + ry) * 1.5;
        const chaosZ = this.originalPositions[i3 + 2];

        // Flow animation along X
        const flowOffset = Math.sin(time * 0.001 + i * 0.01) * 3;

        targetX = THREE.MathUtils.lerp(chaosX, this.pipelineTargets[i3] + flowOffset, eased);
        targetY = THREE.MathUtils.lerp(chaosY, this.pipelineTargets[i3 + 1], eased);
        targetZ = THREE.MathUtils.lerp(chaosZ, this.pipelineTargets[i3 + 2], eased);

        const depthColor = DEPTH_COLORS[depthKeys[phase]];
        r = THREE.MathUtils.lerp(BASE_COLOR.r, depthColor.r, eased);
        g = THREE.MathUtils.lerp(BASE_COLOR.g, depthColor.g, eased);
        b = THREE.MathUtils.lerp(BASE_COLOR.b, depthColor.b, eased);
      } else if (p < 0.52) {
        // Council: orbiting rings
        const t = Math.min((p - 0.35) / 0.10, 1);
        const eased = t * t * (3 - 2 * t);

        const councilIdx = i % 7;
        const radius = 8 + councilIdx * 1.5;
        const orbitSpeed = 0.0002 * (1 + councilIdx * 0.15);
        const baseAngle = (i / count) * Math.PI * 2 * 3 + councilIdx * 0.9;
        const angle = baseAngle + time * orbitSpeed;

        const orbitX = Math.cos(angle) * radius;
        const orbitY = Math.sin(angle) * radius * 0.6;
        const orbitZ = Math.sin(angle * 0.5) * 3;

        // Flow offset from pipeline
        const flowOffset = Math.sin(time * 0.001 + i * 0.01) * 3;

        targetX = THREE.MathUtils.lerp(this.pipelineTargets[i3] + flowOffset, orbitX, eased);
        targetY = THREE.MathUtils.lerp(this.pipelineTargets[i3 + 1], orbitY, eased);
        targetZ = THREE.MathUtils.lerp(this.pipelineTargets[i3 + 2], orbitZ, eased);

        const councilColor = COUNCIL_COLORS[councilIdx];
        const depthColor = DEPTH_COLORS[depthKeys[phase]];
        r = THREE.MathUtils.lerp(depthColor.r, councilColor.r, eased);
        g = THREE.MathUtils.lerp(depthColor.g, councilColor.g, eased);
        b = THREE.MathUtils.lerp(depthColor.b, councilColor.b, eased);
      } else if (p < 0.68) {
        // Research funnel
        const t = Math.min((p - 0.52) / 0.10, 1);
        const eased = t * t * (3 - 2 * t);

        const councilIdx = i % 7;
        const radius = 8 + councilIdx * 1.5;
        const orbitSpeed = 0.0002 * (1 + councilIdx * 0.15);
        const baseAngle = (i / count) * Math.PI * 2 * 3 + councilIdx * 0.9;
        const angle = baseAngle + time * orbitSpeed;

        const orbitX = Math.cos(angle) * radius;
        const orbitY = Math.sin(angle) * radius * 0.6;
        const orbitZ = Math.sin(angle * 0.5) * 3;

        targetX = THREE.MathUtils.lerp(orbitX, this.researchTargets[i3], eased);
        targetY = THREE.MathUtils.lerp(orbitY, this.researchTargets[i3 + 1], eased);
        targetZ = THREE.MathUtils.lerp(orbitZ, this.researchTargets[i3 + 2], eased);

        const councilColor = COUNCIL_COLORS[councilIdx];
        r = THREE.MathUtils.lerp(councilColor.r, CONVERGENCE_COLOR.r, eased * 0.5);
        g = THREE.MathUtils.lerp(councilColor.g, CONVERGENCE_COLOR.g, eased * 0.5);
        b = THREE.MathUtils.lerp(councilColor.b, CONVERGENCE_COLOR.b, eased * 0.5);
      } else if (p < 0.85) {
        // Convergence to point
        const t = Math.min((p - 0.68) / 0.12, 1);
        const eased = t * t * (3 - 2 * t);

        // Breathing
        const breathe = Math.sin(time * 0.002) * 0.5 + 0.5;
        const convergenceRadius = THREE.MathUtils.lerp(2, 0.5, eased) + breathe * 0.3;

        const cr = convergenceRadius / 2;
        const cx = this.convergenceTargets[i3] * cr;
        const cy = this.convergenceTargets[i3 + 1] * cr;
        const cz = this.convergenceTargets[i3 + 2] * cr;

        targetX = THREE.MathUtils.lerp(this.researchTargets[i3], cx, eased);
        targetY = THREE.MathUtils.lerp(this.researchTargets[i3 + 1], cy, eased);
        targetZ = THREE.MathUtils.lerp(this.researchTargets[i3 + 2], cz, eased);

        const brightness = 0.7 + eased * 0.3;
        r = CONVERGENCE_COLOR.r * brightness;
        g = CONVERGENCE_COLOR.g * brightness;
        b = CONVERGENCE_COLOR.b * brightness;
      } else {
        // Tight static point — particles ARE the convergence dot
        const cr = 0.15;

        targetX = this.convergenceTargets[i3] * cr;
        targetY = this.convergenceTargets[i3 + 1] * cr;
        targetZ = this.convergenceTargets[i3 + 2] * cr;

        r = CONVERGENCE_COLOR.r;
        g = CONVERGENCE_COLOR.g;
        b = CONVERGENCE_COLOR.b;
      }

      // Smooth interpolation (lerp toward target)
      const lerpFactor = 0.04;
      positions[i3]     += (targetX - positions[i3]) * lerpFactor;
      positions[i3 + 1] += (targetY - positions[i3 + 1]) * lerpFactor;
      positions[i3 + 2] += (targetZ - positions[i3 + 2]) * lerpFactor;

      // Color interpolation
      colors[i3]     += (r - colors[i3]) * 0.05;
      colors[i3 + 1] += (g - colors[i3 + 1]) * 0.05;
      colors[i3 + 2] += (b - colors[i3 + 2]) * 0.05;
    }

    // Mouse influence (subtle parallax)
    if (!this.isMobile) {
      this.camera.position.x += (this.mouseX * 2 - this.camera.position.x) * 0.02;
      this.camera.position.y += (-this.mouseY * 1.5 - this.camera.position.y) * 0.02;
      this.camera.lookAt(0, 0, 0);
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.geometry.attributes.color.needsUpdate = true;
    this.particles.material.uniforms.uTime.value = time;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.particles.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }

  dispose() {
    this.particles.geometry.dispose();
    this.particles.material.dispose();
    this.renderer.dispose();
  }
}
