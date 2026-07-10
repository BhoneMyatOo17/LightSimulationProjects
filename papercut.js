const card = document.getElementById('card');
const colorLayers = document.querySelectorAll('.stack-color .layer');

// base radius, and how much smaller each deeper layer's circle gets
const baseRadius = 120;
const falloffPerDepth = 8;

card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  colorLayers.forEach((layer) => {
    const depth = Number(layer.dataset.depth);
    const radius = baseRadius - (4 - depth) * falloffPerDepth;

    const gradient = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 0%, black 98%, transparent 90%)`;
    layer.style.maskImage = gradient;
    layer.style.webkitMaskImage = gradient;
  });
});

card.addEventListener('mouseleave', () => {
  colorLayers.forEach((layer) => {
    layer.style.maskImage = 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 100%)';
    layer.style.webkitMaskImage = layer.style.maskImage;
  });
});
card.addEventListener('click', (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ringCount = 3;

  for (let i = 0; i < ringCount; i++) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.animationDelay = `${i * 0.15}s`; // stagger each ring

    card.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }
});