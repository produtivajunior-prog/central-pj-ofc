import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import planeImg from "@/assets/aviao-mascote.png";

type Puff = { id: number; x: number; y: number };

export function PlaneMascot() {
  const reduced = useReducedMotion();
  const [puffs, setPuffs] = useState<Puff[]>([]);
  const planeRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      const el = planeRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const id = ++idRef.current;
      // emit slightly behind (left) of the plane
      const x = rect.left + rect.width * 0.18;
      const y = rect.top + rect.height * 0.65;
      setPuffs((p) => [...p, { id, x, y }]);
      setTimeout(() => setPuffs((p) => p.filter((q) => q.id !== id)), 1600);
    }, 140);
    return () => clearInterval(interval);
  }, [reduced]);

  if (reduced) {
    return (
      <img
        src={planeImg}
        alt=""
        aria-hidden
        className="pointer-events-none fixed bottom-6 right-6 z-30 h-20 w-20 opacity-90"
      />
    );
  }

  // Trajetória cobrindo cantos da tela usando vw/vh strings
  const path = {
    x: ["5vw", "60vw", "80vw", "70vw", "20vw", "5vw"],
    y: ["70vh", "20vh", "55vh", "80vh", "30vh", "70vh"],
    rotate: [0, 8, -6, 10, -8, 0],
  };

  return (
    <>
      {/* Smoke puffs */}
      <div className="pointer-events-none fixed inset-0 z-30">
        {puffs.map((p) => (
          <span
            key={p.id}
            className="smoke-puff"
            style={{ left: p.x, top: p.y }}
          />
        ))}
      </div>

      {/* Plane */}
      <motion.div
        ref={planeRef}
        className="pointer-events-none fixed left-0 top-0 z-30"
        initial={{ x: "5vw", y: "70vh" }}
        animate={path}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      >
        <motion.img
          src={planeImg}
          alt=""
          aria-hidden
          className="h-20 w-20 drop-shadow-lg select-none"
          animate={{ y: [0, -6, 0, 6, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </>
  );
}
