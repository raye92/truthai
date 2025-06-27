import { motion } from "framer-motion";

interface TickerProps {
  text: string;
}

export function Ticker({ text }: TickerProps) {
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", width: "100%" }}>
      <motion.div
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
        style={{ display: "inline-block" }}
      >
        {text}
      </motion.div>
    </div>
  );
}