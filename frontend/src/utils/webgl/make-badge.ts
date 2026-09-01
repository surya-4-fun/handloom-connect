export function makeBadgeTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Clear background as transparent
  ctx.clearRect(0, 0, 512, 512);

  // Chrome Gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0.0, '#ffffff');
  grad.addColorStop(0.15, '#c5cbd3');
  grad.addColorStop(0.3, '#78818f');
  grad.addColorStop(0.45, '#ffffff');
  grad.addColorStop(0.6, '#4f5560');
  grad.addColorStop(0.8, '#a2abb8');
  grad.addColorStop(1.0, '#ffffff');

  // Outer Ring
  ctx.strokeStyle = grad;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 256, 220, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Thin Ring
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(256, 256, 210, 0, Math.PI * 2);
  ctx.stroke();

  // Text "HC"
  ctx.fillStyle = grad;
  ctx.font = 'normal 900 190px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw shadowed background/beveling for premium detail
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 4;
  ctx.fillText('HC', 256, 225);

  // Reset shadow for subtitle
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Subtitle "HANDLOOM" and "CONNECT"
  ctx.fillStyle = '#F5F2EA';
  ctx.font = 'bold 800 22px Inter, system-ui, sans-serif';
  ctx.letterSpacing = '12px';
  ctx.fillText('HANDLOOM', 262, 340); // extra offset for spacing

  ctx.fillStyle = '#B8B2A8'; // muted cream
  ctx.font = 'normal 700 16px Inter, system-ui, sans-serif';
  ctx.letterSpacing = '16px';
  ctx.fillText('CONNECT', 264, 380);

  // Small separator dot
  ctx.fillStyle = '#C8A24C'; // gold
  ctx.beginPath();
  ctx.arc(256, 305, 3, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}
