'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState('/dashboard');

  // Determine redirect path based on role
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user && 'role' in session.user && session.user.role === 'lc') setRedirectPath('/lc-dashboard');
      else setRedirectPath('/dashboard');
    }
  }, [session, status]);

  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function getPaddleWidth() {
      if (!canvas) return 16;
      return Math.max(16, canvas.width * 0.015);
    }
    function getPaddleHeight() {
      if (!canvas) return 80;
      return Math.max(80, canvas.height * 0.18);
    }
    function getBallSize() {
      if (!canvas) return 14;
      return Math.max(14, Math.min(canvas.width, canvas.height) * 0.025);
    }

    // Initial state
    let leftPaddleY = canvas.height / 2 - getPaddleHeight() / 2;
    let rightPaddleY = canvas.height / 2 - getPaddleHeight() / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    // Ball speed (1.45x previous)
    let ballVX = canvas.width * 0.00725 * (Math.random() > 0.5 ? 1 : -1);
    let ballVY = canvas.height * 0.003625 * (Math.random() > 0.5 ? 1 : -1);

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      const paddleWidth = getPaddleWidth();
      const paddleHeight = getPaddleHeight();
      const ballSize = getBallSize();
      const paddleRadius = paddleWidth / 2;

      // Clear screen
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, width, height);

      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(width * 0.04, height * 0.08, width * 0.92, height * 0.84);

      // Draw middle dashed line
      ctx.save();
      ctx.setLineDash([18, 18]);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2, height * 0.08 + 8);
      ctx.lineTo(width / 2, height * 0.92 - 8);
      ctx.stroke();
      ctx.restore();

      // Draw paddles (with glow, rounded ends)
      ctx.save();
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#fff';

      // Left paddle
      ctx.beginPath();
      ctx.roundRect(width * 0.06, leftPaddleY, paddleWidth, paddleHeight, paddleRadius);
      ctx.fill();

      // Right paddle
      ctx.beginPath();
      ctx.roundRect(width - width * 0.06 - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, paddleRadius);
      ctx.fill();

      ctx.restore();

      // Draw ball (with blue glow)
      ctx.save();
      ctx.shadowColor = '#00bfff';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#00bfff';
      ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
      ctx.restore();

      // --- SMOOTH PADDLE MOTION LOGIC ---
      // Both paddles always track the ball (never miss)
      // Fast on their half, slow otherwise
      const leftTarget = Math.max(height * 0.08, Math.min(height * 0.92 - paddleHeight, ballY - paddleHeight / 2));
      const rightTarget = leftTarget; // Both track the ball for reliability
      const leftSpeed = ballX < width / 2 ? 0.14 : 0.035;
      const rightSpeed = ballX >= width / 2 ? 0.14 : 0.035;
      leftPaddleY = lerp(leftPaddleY, leftTarget, leftSpeed);
      rightPaddleY = lerp(rightPaddleY, rightTarget, rightSpeed);

      // Move ball
      ballX += ballVX;
      ballY += ballVY;

      // Ball collision with top/bottom
      if (ballY - ballSize / 2 < height * 0.08) {
        ballY = height * 0.08 + ballSize / 2;
        ballVY = -ballVY;
      }
      if (ballY + ballSize / 2 > height * 0.92) {
        ballY = height * 0.92 - ballSize / 2;
        ballVY = -ballVY;
      }

      // Ball collision with paddles
      if (
        ballX - ballSize / 2 < width * 0.06 + paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
      ) {
        ballX = width * 0.06 + paddleWidth + ballSize / 2;
        ballVX = Math.abs(ballVX);
        ballVY += (Math.random() - 0.5) * 0.6;
      }
      if (
        ballX + ballSize / 2 > width - width * 0.06 - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
      ) {
        ballX = width - width * 0.06 - paddleWidth - ballSize / 2;
        ballVX = -Math.abs(ballVX);
        ballVY += (Math.random() - 0.5) * 0.6;
      }

      // Ball out of bounds: reset (should never happen)
      if (ballX < 0 || ballX > width) {
        ballX = width / 2;
        ballY = height / 2;
        ballVX = width * 0.00725 * (Math.random() > 0.5 ? 1 : -1);
        ballVY = height * 0.003625 * (Math.random() > 0.5 ? 1 : -1);
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Overlay content
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-0">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none select-none"
        style={{ display: 'block' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1
          className="text-white text-[min(16vw,120px)] font-mono font-extrabold drop-shadow-[0_0_24px_white] leading-none tracking-widest mb-4"
          style={{
            textShadow: '0 0 18px #fff, 0 0 8px #fff',
            fontFamily: 'monospace, monospace',
            filter: 'brightness(1.4)',
            letterSpacing: '0.02em',
          }}
        >
          Unauthorized
        </h1>
        <p className="text-white text-2xl md:text-3xl font-semibold mb-6 text-center drop-shadow-[0_0_8px_black] pointer-events-auto">
          Looks like you missed the ball.
        </p>
        <button
          className="pointer-events-auto border-2 bg-zinc-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-zinc-800 transition text-lg
            relative before:absolute before:inset-0 before:rounded-full before:blur-[8px] before:bg-white/70 before:opacity-60 before:z-[-1]"
          style={{
            boxShadow: '0 0 10px 4px #fff, 0 0 3px 1px #fff',
            borderColor: '#fff',
          }}
          onClick={() => router.push(redirectPath)}
        >
          Home
        </button>
      </div>
    </div>
  );
}
