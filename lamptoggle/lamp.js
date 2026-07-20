 (function () {
      const svg = document.getElementById('lamp-svg');
      const stringPath = document.getElementById('string-path');
      const knob = document.getElementById('string-knob');
      const glowOuter = document.getElementById('glow-outer-shape');
      const glowCore = document.getElementById('glow-core-shape');

      const pivotX = 120;
      const pivotY = 20;
      const restLength = 300;
      const maxStretch = 170;
      const minStretch = -14;
      const maxSwing = 150;
      const pullThreshold = 55;

      let stretch = 0, velocity = 0;
      let xOffset = 0, xVelocity = 0;
      let waveAmp = 0, wavePhase = 0;
      let dragging = false, maxStretchSeen = 0;
      let isOn = false;
      let raf = null;

      function toSvgPoint(clientX, clientY) {
        const pt = svg.createSVGPoint();
        pt.x = clientX; pt.y = clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
      }

      function render() {
        const knobY = pivotY + restLength + stretch;
        const knobXPos = pivotX + xOffset;
        const segments = 14;
        let d = '';
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const baseX = pivotX + t * (knobXPos - pivotX);
          const y = pivotY + t * (knobY - pivotY);
          const envelope = Math.sin(t * Math.PI);
          const x = baseX + waveAmp * envelope * Math.sin(t * Math.PI * 2.4 + wavePhase);
          d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
        }
        stringPath.setAttribute('d', d);
        knob.setAttribute('cy', knobY);
        knob.setAttribute('cx', knobXPos);
      }

      function toggleLight() {
        isOn = !isOn;
        glowOuter.style.opacity = isOn ? '1' : '0';
        glowCore.style.opacity = isOn ? '1' : '0';
      }

      function step() {
        const k = 28, c = 5.2, dt = 1 / 60;
        const accel = -k * stretch - c * velocity;
        velocity += accel * dt;
        stretch += velocity * dt;
        if (stretch < minStretch) { stretch = minStretch; velocity = Math.abs(velocity) * 0.3; }

        const kx = 24, cx = 4.6;
        const xAccel = -kx * xOffset - cx * xVelocity;
        xVelocity += xAccel * dt;
        xOffset += xVelocity * dt;

        waveAmp *= 0.965;
        wavePhase += 0.22;

        const settled = Math.abs(stretch) < 0.4 && Math.abs(velocity) < 0.4
          && Math.abs(xOffset) < 0.4 && Math.abs(xVelocity) < 0.4 && waveAmp < 0.3;
        if (settled) {
          stretch = 0; velocity = 0; xOffset = 0; xVelocity = 0; waveAmp = 0;
          render();
          raf = null;
          return;
        }
        render();
        raf = requestAnimationFrame(step);
      }

      function startDrag(e) {
        dragging = true;
        maxStretchSeen = 0;
        waveAmp = 0;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        knob.style.cursor = 'grabbing';
        svg.setPointerCapture(e.pointerId);
      }

      function moveDrag(e) {
        if (!dragging) return;
        const p = toSvgPoint(e.clientX, e.clientY);
        let s = p.y - pivotY - restLength;
        s = Math.max(0, Math.min(maxStretch, s));
        stretch = s;
        velocity = 0;
        maxStretchSeen = Math.max(maxStretchSeen, stretch);

        let ox = p.x - pivotX;
        ox = Math.max(-maxSwing, Math.min(maxSwing, ox));
        xOffset = ox;
        xVelocity = 0;
        render();
      }

      function endDrag() {
        if (!dragging) return;
        dragging = false;
        knob.style.cursor = 'grab';
        if (maxStretchSeen > pullThreshold) {
          toggleLight();
        }
        velocity = 0;
        xVelocity = 0;
        waveAmp = Math.min(30, 8 + maxStretchSeen * 0.16);
        wavePhase = 0;
        raf = requestAnimationFrame(step);
      }

      knob.addEventListener('pointerdown', startDrag);
      svg.addEventListener('pointermove', moveDrag);
      svg.addEventListener('pointerup', endDrag);
      svg.addEventListener('pointercancel', endDrag);

      render();
    })();