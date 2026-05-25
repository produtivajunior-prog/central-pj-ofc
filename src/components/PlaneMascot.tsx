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
      const x = rect.left + rect.width * 0.18;
      const y = rect.top + rect.height * 0.65;
      setPuffs((p) => [...p, { id, x, y }]);
      setTimeout(() => setPuffs((p) => p.filter((q) => q.id !== id)), 1800);
    }, 160);
    return () => clearInterval(interval);
  }, [reduced]);

  return (
    <>
      {/* Sky background + clouds (behind everything) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden sky-bg">
        <Cloud className="cloud-a" top="8%" size={160} />
        <Cloud className="cloud-b" top="22%" size={110} />
        <Cloud className="cloud-c" top="45%" size={200} />
        <Cloud className="cloud-d" top="65%" size={130} />
        <Cloud className="cloud-e" top="80%" size={170} />
      </div>

      {/* Smoke puffs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {puffs.map((p) => (
          <span
            key={p.id}
            className="smoke-puff"
            style={{ left: p.x, top: p.y }}
          />
        ))}
      </div>

      {/* Plane flying behind content */}
      {reduced ? (
        <img
          src={planeImg}
          alt=""
          aria-hidden
          className="pointer-events-none fixed bottom-10 right-10 z-0 h-24 w-24 opacity-90"
        />
      ) : (
        <motion.div
          ref={planeRef}
          className="pointer-events-none fixed left-0 top-0 z-0"
          initial={{ x: "5vw", y: "70vh" }}
          animate={{
            x: ["5vw", "60vw", "80vw", "70vw", "20vw", "5vw"],
            y: ["70vh", "20vh", "55vh", "80vh", "30vh", "70vh"],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          }}
        >
          <motion.img
            src={planeImg}
            alt=""
            aria-hidden
            width={96}
            height={96}
            className="h-24 w-24 select-none drop-shadow-xl"
            animate={{ y: [0, -8, 0, 8, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </>
  );
}

function Cloud({
  className = "",
  top,
  size,
}: {
  className?: string;
  top: string;
  size: number;
}) {
  return (
    <svg
      className={`absolute opacity-90 ${className}`}
      style={{ top, width: size, height: size * 0.6 }}
      viewBox="0 0 200 120"
      fill="white"
      aria-hidden
    >
      <ellipse cx="60" cy="80" rx="50" ry="30" />
      <ellipse cx="110" cy="65" rx="55" ry="38" />
      <ellipse cx="155" cy="85" rx="40" ry="28" />
      <ellipse cx="90" cy="90" rx="60" ry="25" />
    </svg>
  );
}
