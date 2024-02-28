// components/timer.tsx

import { useEffect, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const Timer = () => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 font-bold text-red-500 text-[45px]">
      <div>{`${Math.floor((time / HOUR) % 24)}`.padStart(2, "0")}</div>
      <div>:</div>
      <div>{`${Math.floor((time / MINUTE) % 60)}`.padStart(2, "0")}</div>
      <div>:</div>
      <div>{`${Math.floor((time / SECOND) % 60)}`.padStart(2, "0")}</div>
    </div>
  );
};

export default Timer;
