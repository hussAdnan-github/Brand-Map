import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// ===== Fade In Up =====
export function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== Fade In Scale =====
export function FadeInScale({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== Stagger Children =====
export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  className = '',
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== Slide In Direction =====
export function SlideIn({
  children,
  direction = 'right',
  delay = 0,
  duration = 0.5,
  className = '',
}: {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const xDir = direction === 'left' ? -40 : direction === 'right' ? 40 : 0;
  const yDir = direction === 'up' ? 40 : direction === 'down' ? -40 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: xDir, y: yDir }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== Animated Page Transition =====
export function PageTransition({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== Animated Switch (for tabs/stages) =====
export function AnimatedSwitch({
  children,
  keyProp,
  className = '',
}: {
  children: React.ReactNode;
  keyProp: string | number;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ===== Card Selection Animation =====
export function AnimatedCard({
  children,
  isSelected,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        scale: isSelected ? 1.02 : 1,
        borderColor: isSelected ? 'rgba(200, 146, 43, 0.6)' : 'rgba(217, 205, 174, 0.2)',
        backgroundColor: isSelected ? 'rgba(200, 146, 43, 0.1)' : 'rgba(14, 17, 22, 0.2)',
      }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`text-right transition-all ${className}`}
    >
      {children}
    </motion.button>
  );
}

// ===== Progress Bar Animation =====
export function AnimatedProgress({
  value,
  max = 100,
  color = '#C8922B',
  className = '',
  height = 6,
}: {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  height?: number;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={`bg-bm-warm/20 rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ===== Maturity Dots Animation =====
export function AnimatedMaturityDots({
  level,
  max = 5,
  color,
  size = 8,
  gap = 2,
}: {
  level: number;
  max?: number;
  color: string;
  size?: number;
  gap?: number;
}) {
  return (
    <div className="flex" style={{ gap }}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{
            scale: i < level ? 1 : 0.6,
            backgroundColor: i < level ? color : 'rgba(255,255,255,0.1)',
          }}
          transition={{
            duration: 0.3,
            delay: i * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="rounded-full"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

// ===== Conflicts Panel Animation =====
export function AnimatedExpand({
  children,
  isOpen,
  className = '',
}: {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ===== Count Up Number =====
export function CountUp({
  value,
  duration = 1,
  className = '',
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / (duration * 1000), 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

// ===== Pulse Badge =====
export function PulseBadge({
  children,
  color = '#D7322E',
  className = '',
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}00`,
          `0 0 0 4px ${color}20`,
          `0 0 0 0 ${color}00`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== Activity Feed Item =====
export function ActivityItem({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== Hover Lift =====
export function HoverLift({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ===== Stage Tab Transition =====
export function StageTab({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        scale: isActive ? 1.05 : 1,
        opacity: isActive ? 1 : 0.6,
      }}
      whileHover={{ opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 px-3 py-2 rounded-lg font-cairo text-xs whitespace-nowrap"
    >
      {children}
    </motion.button>
  );
}