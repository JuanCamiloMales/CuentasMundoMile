import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  storageKey?: string;
}

type FabSide = 'left' | 'right';
interface FabPosition {
  side: FabSide;
  bottom: number;
}

const DEFAULT_POSITION: FabPosition = { side: 'right', bottom: 96 };
const SIDE_OFFSET_PX = 20;
const MIN_BOTTOM_PX = 48;
const MAX_BOTTOM_PX = 168;
const DRAG_THRESHOLD_PX = 6;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isFabSide = (v: unknown): v is FabSide => v === 'left' || v === 'right';

const isFabPosition = (v: unknown): v is FabPosition => {
  if (!v || typeof v !== 'object') return false;
  const obj = v as Record<string, unknown>;
  return (
    isFabSide(obj.side) &&
    typeof obj.bottom === 'number' &&
    Number.isFinite(obj.bottom)
  );
};

const loadPosition = (key: string): FabPosition => {
  if (typeof window === 'undefined') return DEFAULT_POSITION;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return DEFAULT_POSITION;
    const parsed: unknown = JSON.parse(raw);
    if (!isFabPosition(parsed)) return DEFAULT_POSITION;
    return {
      side: parsed.side,
      bottom: clamp(parsed.bottom, MIN_BOTTOM_PX, MAX_BOTTOM_PX),
    };
  } catch {
    return DEFAULT_POSITION;
  }
};

const savePosition = (key: string, position: FabPosition): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(position));
  } catch {
    // ignore quota / private mode errors
  }
};

export function FAB({
  icon,
  label,
  storageKey = 'fab:default',
  className = '',
  onClick,
  ...rest
}: FABProps) {
  const [position, setPosition] = useState<FabPosition>(DEFAULT_POSITION);
  const [dragging, setDragging] = useState(false);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startBottom: number;
    hasMoved: boolean;
    movedDistance: number;
  } | null>(null);
  const shouldBlockClickRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setPosition(loadPosition(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setPosition((prev) => ({
        ...prev,
        bottom: clamp(prev.bottom, MIN_BOTTOM_PX, MAX_BOTTOM_PX),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startBottom: position.bottom,
      hasMoved: false,
      movedDistance: 0,
    };
    shouldBlockClickRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    const deltaY = e.clientY - state.startY;
    const deltaX = e.clientX - state.startX;
    const distance = Math.hypot(deltaX, deltaY);
    if (distance > state.movedDistance) state.movedDistance = distance;
    if (!state.hasMoved && state.movedDistance > DRAG_THRESHOLD_PX) {
      state.hasMoved = true;
      setDragging(true);
    }
    if (state.hasMoved) {
      const nextBottom = clamp(state.startBottom - deltaY, MIN_BOTTOM_PX, MAX_BOTTOM_PX);
      setPosition((prev) => ({ ...prev, bottom: nextBottom }));
    }
  };

  const finalizeDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (state.hasMoved) {
      const releaseX = e.clientX;
      const nextSide: FabSide = releaseX < window.innerWidth / 2 ? 'left' : 'right';
      const nextPosition: FabPosition = { side: nextSide, bottom: position.bottom };
      setPosition(nextPosition);
      savePosition(storageKey, nextPosition);
      shouldBlockClickRef.current = true;
      e.preventDefault();
      e.stopPropagation();
    }
    dragStateRef.current = null;
    setDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldBlockClickRef.current) {
      shouldBlockClickRef.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  const style: CSSProperties = {
    position: 'fixed',
    bottom: `${position.bottom}px`,
    [position.side]: `${SIDE_OFFSET_PX}px`,
    zIndex: 30,
    touchAction: 'none',
  };

  return (
    <button
      {...rest}
      ref={buttonRef}
      type="button"
      aria-label={label}
      title={label}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finalizeDrag}
      onPointerCancel={finalizeDrag}
      onClick={handleClick}
      className={[
        'flex h-14 w-14 select-none items-center justify-center rounded-full bg-whatsapp-accent text-white shadow-lg transition active:scale-95 hover:bg-whatsapp-teal disabled:opacity-60',
        dragging ? 'cursor-grabbing' : 'cursor-grab',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon}
    </button>
  );
}