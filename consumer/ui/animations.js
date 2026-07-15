const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function countUp(element, value, formatter) {
  if (reducedMotion()) { element.textContent = formatter(value); return; }
  const start = performance.now();
  const duration = 650;
  const frame = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    element.textContent = formatter(value * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
