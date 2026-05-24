'use client';

import { useScroll, useSpring, motion } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX, width: '100%' }} />;
}
