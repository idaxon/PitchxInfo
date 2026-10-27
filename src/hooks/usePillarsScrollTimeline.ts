import { useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import type { RefObject } from 'react';
import { useState, useEffect } from 'react';

export function usePillarsScrollTimeline(containerRef: RefObject<HTMLDivElement | null>) {
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth scrubbing spring for fluid responsiveness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  // Track active step for vertical indicator (01, 02, 03)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      if (latest < 0.45) {
        setActiveStep(1);
      } else if (latest < 0.75) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Indicator progress bar (0% -> 100%)
  const indicatorLineHeight = useTransform(smoothProgress, [0.05, 0.98], ['0%', '100%']);

  // ==========================================
  // CARD 1: Proof of Work — visible 0.05→0.45
  // ==========================================
  const card1Opacity = useTransform(
    smoothProgress,
    [0.05, 0.12, 0.42, 0.48, 0.72, 0.78, 0.98],
    [0,    1,    1,    1,    0.65, 0.65, 0.40]
  );

  const card1Z = useTransform(
    smoothProgress,
    [0.05, 0.40, 0.46, 0.72, 0.78, 0.98],
    [-400, 0,   0,   -120, -120, -240]
  );

  const card1X = useTransform(
    smoothProgress,
    [0.05, 0.40, 0.46, 0.72, 0.78, 0.98],
    [0,    0,   0,   -40,  -40,  -80]
  );

  const card1Y = useTransform(
    smoothProgress,
    [0.05, 0.40, 0.46, 0.72, 0.78, 0.98],
    [0,    0,   0,   -24,  -24,  -48]
  );

  const card1RotateY = useTransform(
    smoothProgress,
    [0.05, 0.40, 0.46, 0.98],
    [-18,  -6,  -6,  -6]
  );

  const card1Scale = useTransform(
    smoothProgress,
    [0.05, 0.40, 0.46, 0.72, 0.78, 0.98],
    [0.94, 1,   1,   0.92, 0.92, 0.85]
  );

  // Card 1 mini UI progress bar (98.4%)
  const card1BarWidth = useTransform(
    smoothProgress,
    [0.10, 0.38],
    ['0%', '98.4%']
  );

  // ==========================================
  // CARD 2: Verified Skills & Proof Score — visible 0.42→0.78
  // ==========================================
  const card2Opacity = useTransform(
    smoothProgress,
    [0.40, 0.47, 0.72, 0.78, 0.98],
    [0,   1,   1,   0.65, 0.65]
  );

  const card2Z = useTransform(
    smoothProgress,
    [0.42, 0.70, 0.76, 0.98],
    [-400, 0,   -120, -120]
  );

  const card2X = useTransform(
    smoothProgress,
    [0.42, 0.70, 0.76, 0.98],
    [0,   0,   -40,  -40]
  );

  const card2Y = useTransform(
    smoothProgress,
    [0.42, 0.70, 0.76, 0.98],
    [0,   0,   -24,  -24]
  );

  const card2RotateY = useTransform(
    smoothProgress,
    [0.42, 0.70, 0.76, 0.98],
    [-18,  -6,  -6,  -6]
  );

  const card2Scale = useTransform(
    smoothProgress,
    [0.42, 0.70, 0.76, 0.98],
    [0.94, 1,   0.92, 0.92]
  );

  // Card 2 mini UI progress bars
  const card2Bar1Width = useTransform(smoothProgress, [0.48, 0.60], ['0%', '92%']);
  const card2Bar2Width = useTransform(smoothProgress, [0.52, 0.64], ['0%', '88%']);
  const card2Bar3Width = useTransform(smoothProgress, [0.56, 0.68], ['0%', '85%']);

  // ==========================================
  // CARD 3: Smarter Recruiter Filtering — visible 0.74→1.0
  // ==========================================
  const card3Opacity = useTransform(
    smoothProgress,
    [0.72, 0.80, 1.0],
    [0,   1,   1]
  );

  const card3Z = useTransform(
    smoothProgress,
    [0.72, 0.92, 1.0],
    [-400, 0,   0]
  );

  const card3X = useTransform(
    smoothProgress,
    [0.72, 0.92, 1.0],
    [0,   0,   0]
  );

  const card3Y = useTransform(
    smoothProgress,
    [0.72, 0.92, 1.0],
    [0,   0,   0]
  );

  const card3RotateY = useTransform(
    smoothProgress,
    [0.72, 0.92, 1.0],
    [-18,  -6,  -6]
  );

  const card3Scale = useTransform(
    smoothProgress,
    [0.72, 0.92, 1.0],
    [0.94, 1,   1]
  );

  return {
    smoothProgress,
    activeStep,
    indicatorLineHeight,
    prefersReducedMotion,
    card1: {
      opacity: card1Opacity,
      z: card1Z,
      x: card1X,
      y: card1Y,
      rotateY: card1RotateY,
      scale: card1Scale,
      barWidth: card1BarWidth,
    },
    card2: {
      opacity: card2Opacity,
      z: card2Z,
      x: card2X,
      y: card2Y,
      rotateY: card2RotateY,
      scale: card2Scale,
      bar1Width: card2Bar1Width,
      bar2Width: card2Bar2Width,
      bar3Width: card2Bar3Width,
    },
    card3: {
      opacity: card3Opacity,
      z: card3Z,
      x: card3X,
      y: card3Y,
      rotateY: card3RotateY,
      scale: card3Scale,
    },
  };
}
