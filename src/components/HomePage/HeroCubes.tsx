import ScaleAnimation from "@/animations/ScaleAnimation";
import { Breakpoint, useBreakpoint } from "@/lib/hooks/useBreakPoints";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function HeroCubes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cubesMap, setCubesMap] = useState<number[][]>([]);
  const [cubeSize, setCubeSize] = useState(0);
  const bp = useBreakpoint();

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
    { count: 2, maxValue: 5, offset: 0 },
    { count: 2, maxValue: 4, offset: 2 },
    { count: 6, maxValue: 6, offset: 2 },
    { count: 2, maxValue: 4, offset: 2 },
    { count: 2, maxValue: 5, offset: 0 },
  ];

  const colsConfig = {
    xs: 5,
    sm: 7,
    md: 9,
    lg: 12,
    xl: 14,
    "2xl": 17,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.getBoundingClientRect().width;
    const cols = colsConfig[bp];
    const cubeSize = (width - (cols - 1) * 4) / cols;
    setCubeSize(cubeSize);

    const tempMap = rowConfig.flatMap(({ count, maxValue, offset }) =>
      Array.from({ length: count }, () =>
        Array.from({ length: cols }, () =>
          Math.round(Math.random() * maxValue + offset),
        ),
      ),
    );

    setCubesMap(tempMap);
  }, [bp]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const cols = colsConfig[bp];
      const cubeSize = (width - (cols - 1) * 4) / cols;
      setCubeSize(cubeSize);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [bp]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full absolute z-0 flex flex-col gap-1 overflow-hidden"
    >
      {cubesMap.map((cubes, y) => (
        <div className="flex gap-1" key={y}>
          {cubes.map((cube, x) => (
            <ScaleAnimation
              scale={0.9}
              animationKey={`${y}${x}`}
              key={`${y}${x}`}
              position={y}
            >
              <div
                style={{ width: cubeSize, height: cubeSize, flexShrink: 0 }}
                className={`${colorMap.get(cube)}`}
              />
            </ScaleAnimation>
          ))}
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-900 from-10% pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900 from-10% pointer-events-none" />
    </div>
  );
}
