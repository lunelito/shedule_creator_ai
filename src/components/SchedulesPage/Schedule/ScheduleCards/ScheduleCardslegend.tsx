import React from "react";

type ScheduleCardslegend = {
  colors: Map<number, string>;
};

export default function ScheduleCardslegend({
  colors,
}: ScheduleCardslegend) {
  const info = [
    "0 os.",
    "1-5",
    "5-10",
    "10-15",
    "15-20",
    "20+",
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-between w-full text-[10px] sm:text-xs md:text-sm">
      {info.map((el, i) => (
        <div
          className="flex items-center gap-1 bg-zinc-900/40 px-2 py-1 rounded-full"
          key={el}
        >
          <div
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0 ${colors.get(
              i
            )}`}
          />

          <p className="text-zinc-300 whitespace-nowrap">{el}</p>
        </div>
      ))}
    </div>
  );
}