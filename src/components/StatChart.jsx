import React, { useRef, useEffect } from 'react';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 150, 255];
}

export default function StatChart({
  chartData,
  width = 400,
  height = 200,
  color = '#00c9ff',
  label = '',
  showPoints = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = 45;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    if (!chartData.length) {
      return;
    }
    const getValue = point => Number(point.value ?? point.y ?? 0);
    const values = chartData.map(getValue);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const getX = i => padding + (innerWidth * i) / Math.max(1, chartData.length - 1);
    const getY = val => padding + innerHeight - (innerHeight * (val - minVal)) / range;

    ctx.clearRect(0, 0, width, height);

    const rgb = hexToRgb(color);

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, `rgba(${rgb.join(',')}, 0.3)`);
    gradient.addColorStop(1, `rgba(${rgb.join(',')}, 0)`);

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(getValue(chartData[0])));
    for (let i = 1; i < chartData.length; i++) {
      const x = getX(i);
      const y = getY(getValue(chartData[i]));
      const prevX = getX(i - 1);
      const prevY = getY(getValue(chartData[i - 1]));
      const cpX = (prevX + x) / 2;
      ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
    ctx.lineTo(getX(chartData.length - 1), height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(getValue(chartData[0])));
    for (let i = 1; i < chartData.length; i++) {
      const x = getX(i);
      const y = getY(getValue(chartData[i]));
      const prevX = getX(i - 1);
      const prevY = getY(getValue(chartData[i - 1]));
      const cpX = (prevX + x) / 2;
      ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    if (showPoints) {
      for (let i = 0; i < chartData.length; i++) {
        if (
          i % Math.max(1, Math.floor(chartData.length / 10)) === 0 ||
          i === chartData.length - 1
        ) {
          const x = getX(i);
          const y = getY(getValue(chartData[i]));
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = '#0a0a12';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
      const y = padding + (innerHeight * i) / 4;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#888';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const val = maxVal - (range * i) / 4;
      const y = padding + (innerHeight * i) / 4;
      ctx.fillText(val.toLocaleString(), padding - 8, y);
    }

    ctx.fillStyle = '#aaa';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < chartData.length; i += Math.max(1, Math.floor(chartData.length / 6))) {
      const x = getX(i);
      ctx.fillText(chartData[i].label, x, height - padding + 4);
    }

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(label, padding, padding - 10);
  }, [chartData, width, height, color, label, showPoints]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      role="img"
      aria-label={label || 'Life statistics chart'}
      style={{
        width: '100%',
        maxWidth: width,
        height: 'auto',
        aspectRatio: `${width} / ${height}`,
        display: 'block',
      }}
    />
  );
}
