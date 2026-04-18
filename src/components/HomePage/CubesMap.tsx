import FadeAnimation from "@/animations/FadeAnimation";
import React, { useEffect, useRef, useState } from "react";

export default function CubesMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cubesMap, setCubesMap] = useState<number[][]>([]);
  const cubeSize = 64

  const colorMap = new Map<number, string>([
    [0, ""],
    [1, ""],
    [2, ""],
    [3, ""],
    [4, "bg-teal-900"],
    [5, "bg-teal-700"],
    [6, "bg-teal-600"],
    [7, "bg-teal-500"],
    [8, "bg-teal-400"],
  ]);

  const rowConfig = [
    { count: 3, maxValue: 5, offset: 0 },
    { count: 3, maxValue: 4, offset: 2 },
    { count: 6, maxValue: 6, offset: 2 },
  ];

  useEffect(() => {
    const cols = 50;

    const tempMap = rowConfig.flatMap(({ count, maxValue, offset }) =>
      Array.from({ length: count }, () =>
        Array.from({ length: cols }, () =>
          Math.round(Math.random() * maxValue + offset),
        ),
      ),
    );

    setCubesMap(tempMap);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-1 w-full overflow-hidden"
    >
      {cubesMap.map((cubes, y) => (
        <div className="flex gap-1" key={y}>
          {cubes.map((cube, x) => (
            <FadeAnimation animationKey={`${y}${x}`} key={`${y}${x}`}>
              <div
                style={{ width: cubeSize, height: cubeSize, flexShrink: 0 }}
                className={`${colorMap.get(cube)}`}
              />
            </FadeAnimation>
          ))}
        </div>
      ))}
    </div>
  );
}
