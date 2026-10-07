import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

interface VisualizerProps {
  className?: string;
  barCount?: number;
  height?: number;
  color?: string;
}

export const AudioVisualizer: React.FC<VisualizerProps> = ({
  className = 'w-full h-16',
  barCount = 36,
  color = '#f59e0b',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { analyser, isPlaying } = usePlayer();
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bufferLength = 64;
    let dataArray = new Uint8Array(bufferLength);

    if (analyser) {
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray as any);
      } else {
        // Fallback rhythmic idle wave
        for (let i = 0; i < bufferLength; i++) {
          if (isPlaying) {
            const time = Date.now() * 0.005;
            dataArray[i] = Math.floor(
              (Math.sin(time + i * 0.25) * 0.5 + 0.5) * 160 +
                (Math.cos(time * 1.5 + i * 0.5) * 0.5 + 0.5) * 70
            );
          } else {
            dataArray[i] = 12; // Flat idle state
          }
        }
      }

      const barWidth = (width / barCount) - 3;
      let x = 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * (bufferLength / 2));
        const value = dataArray[dataIndex] || 0;
        const percent = value / 255;
        const barHeight = Math.max(4, percent * height * 0.95);

        // Gradient from amber-500 to amber-300
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#d97706'); // amber-600
        gradient.addColorStop(0.5, '#f59e0b'); // amber-500
        gradient.addColorStop(1, '#fde68a'); // amber-200

        ctx.fillStyle = isPlaying ? gradient : '#3f3f46';
        ctx.beginPath();
        ctx.roundRect(x, height - barHeight, Math.max(2, barWidth), barHeight, [2, 2, 0, 0]);
        ctx.fill();

        x += barWidth + 3;
      }
    };

    render();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={80}
      className={`rounded-lg ${className}`}
    />
  );
};
