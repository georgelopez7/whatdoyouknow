"use client";

import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

function Confetti() {
  return <Fireworks autorun={{ speed: 2, duration: 8000 }} />;
}

export default Confetti;
