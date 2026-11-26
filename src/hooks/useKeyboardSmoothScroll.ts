import { useState, useEffect, useRef, useCallback } from 'react';

export interface KeyboardSmoothScrollOptions {
  initialSpeed?: number;
}

export function useKeyboardSmoothScroll(options: KeyboardSmoothScrollOptions = {}) {
  const { initialSpeed = 0.10 } = options;

  // Speed setting (0.01 to 5.00)
  const [speed, setSpeedState] = useState<number>(initialSpeed);

  // Animation controller refs
  const speedRef = useRef<number>(speed);
  const currentYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const targetYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  
  // Track active press and timing
  const isDownHeldRef = useRef<boolean>(false);
  const isUpHeldRef = useRef<boolean>(false);
  const downPressStartRef = useRef<number>(0);
  const upPressStartRef = useRef<number>(0);

  const animFrameIdRef = useRef<number | null>(null);

  // Sync speed ref
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Set speed helper with clamping
  const setSpeed = useCallback((newSpeed: number) => {
    const clamped = Math.max(0.01, Math.min(5.0, Number(newSpeed.toFixed(2))));
    setSpeedState(clamped);
    speedRef.current = clamped;
  }, []);

  // Compute single-step scroll distance based on speed
  const getStepDistance = useCallback((curSpeed: number) => {
    // 0.01 -> 30px, 0.10 -> 42px, 0.50 -> 90px, 1.00 -> 150px
    return Math.max(30, Math.min(250, Math.round(30 + curSpeed * 120)));
  }, []);

  // Detect manual mousewheel or scrollbar scrolling to keep in sync
  useEffect(() => {
    const handleScroll = () => {
      const actualY = window.scrollY;
      const diff = Math.abs(actualY - currentYRef.current);
      // If user scrolled via mouse wheel or scrollbar while not actively pressing keys
      if (diff > 8.0 && !isDownHeldRef.current && !isUpHeldRef.current && Math.abs(targetYRef.current - currentYRef.current) < 1.0) {
        currentYRef.current = actualY;
        targetYRef.current = actualY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Start down press (mousedown, touchstart, or keydown)
  const onDownPressStart = useCallback(() => {
    downPressStartRef.current = performance.now();
    isDownHeldRef.current = true;
    currentYRef.current = window.scrollY;
    targetYRef.current = window.scrollY;
  }, []);

  // End down press (mouseup, touchend, or keyup)
  const onDownPressEnd = useCallback(() => {
    const pressDuration = performance.now() - downPressStartRef.current;
    isDownHeldRef.current = false;

    if (pressDuration < 160) {
      // Single quick click/tap: advance one clean step and then stop!
      const step = getStepDistance(speedRef.current);
      targetYRef.current = currentYRef.current + step;
    } else {
      // Was a continuous hold: stop immediately on release!
      targetYRef.current = currentYRef.current;
    }
  }, [getStepDistance]);

  // Direct trigger for button click
  const triggerDownStep = useCallback(() => {
    const step = getStepDistance(speedRef.current);
    currentYRef.current = window.scrollY;
    targetYRef.current = window.scrollY + step;
  }, [getStepDistance]);

  // Up press controls
  const onUpPressStart = useCallback(() => {
    upPressStartRef.current = performance.now();
    isUpHeldRef.current = true;
    currentYRef.current = window.scrollY;
    targetYRef.current = window.scrollY;
  }, []);

  const onUpPressEnd = useCallback(() => {
    const pressDuration = performance.now() - upPressStartRef.current;
    isUpHeldRef.current = false;

    if (pressDuration < 160) {
      const step = getStepDistance(speedRef.current);
      targetYRef.current = Math.max(0, currentYRef.current - step);
    } else {
      targetYRef.current = currentYRef.current;
    }
  }, [getStepDistance]);

  const triggerUpStep = useCallback(() => {
    const step = getStepDistance(speedRef.current);
    currentYRef.current = window.scrollY;
    targetYRef.current = Math.max(0, window.scrollY - step);
  }, [getStepDistance]);

  // Main animation frame loop
  useEffect(() => {
    currentYRef.current = window.scrollY;
    targetYRef.current = window.scrollY;

    const loop = () => {
      const curSpeed = speedRef.current;
      // Hold velocity per frame (speed * 3.0)
      const holdVelocity = Math.max(0.05, curSpeed * 3.0);

      // 1. Continuous Hold Mode (when key/button is actively held down > 160ms)
      if (isDownHeldRef.current && (performance.now() - downPressStartRef.current) >= 160) {
        currentYRef.current += holdVelocity;
        targetYRef.current = currentYRef.current;
        window.scrollTo({
          top: currentYRef.current,
          left: 0,
          behavior: 'instant' as ScrollBehavior,
        });
      } else if (isUpHeldRef.current && (performance.now() - upPressStartRef.current) >= 160) {
        currentYRef.current = Math.max(0, currentYRef.current - holdVelocity);
        targetYRef.current = currentYRef.current;
        window.scrollTo({
          top: currentYRef.current,
          left: 0,
          behavior: 'instant' as ScrollBehavior,
        });
      } else {
        // 2. Discrete Step Mode (from single click or PageDown)
        const diff = targetYRef.current - currentYRef.current;

        if (Math.abs(diff) > 0.5) {
          // Smoothly animate towards target in ~250ms, then STOP completely!
          const stepSpeed = Math.max(1.2, Math.min(Math.abs(diff) * 0.18, 15.0));
          if (diff > 0) {
            currentYRef.current += Math.min(diff, stepSpeed);
          } else {
            currentYRef.current -= Math.min(-diff, stepSpeed);
          }
          window.scrollTo({
            top: currentYRef.current,
            left: 0,
            behavior: 'instant' as ScrollBehavior,
          });
        } else if (Math.abs(diff) > 0) {
          // Snap exact and finish: NO more movement!
          currentYRef.current = targetYRef.current;
          window.scrollTo({
            top: currentYRef.current,
            left: 0,
            behavior: 'instant' as ScrollBehavior,
          });
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Keyboard listeners for ArrowDown, PageDown, ArrowUp, PageUp
  useEffect(() => {
    let downKeyActive = false;
    let upKeyActive = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside text input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Down navigation keys: ArrowDown, Space, PageDown
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'PageDown') {
        e.preventDefault();
        // Blur any focused button so Spacebar doesn't trigger synthetic button clicks
        if (document.activeElement instanceof HTMLElement && document.activeElement.tagName === 'BUTTON') {
          document.activeElement.blur();
        }
        if (!downKeyActive) {
          downKeyActive = true;
          onDownPressStart();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (!upKeyActive) {
          upKeyActive = true;
          onUpPressStart();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'PageDown') {
        downKeyActive = false;
        onDownPressEnd();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        upKeyActive = false;
        onUpPressEnd();
      }
    };

    const handleBlur = () => {
      downKeyActive = false;
      upKeyActive = false;
      isDownHeldRef.current = false;
      isUpHeldRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onDownPressStart, onDownPressEnd, onUpPressStart, onUpPressEnd]);

  return {
    speed,
    setSpeed,
    onDownPressStart,
    onDownPressEnd,
    triggerDownStep,
    onUpPressStart,
    onUpPressEnd,
    triggerUpStep,
  };
}
