import React, { useState } from "react";
type SelectGroup = {
  options: string[];
  title: string;
};

export default function SelectGroup({ options, title }: SelectGroup) {
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-64">
      <h1 className="p-1 mb-1 text-lg">{title}</h1>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-800  rounded-md shadow-sm px-4 py-2 flex justify-between items-center hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        {selected}
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-zinc-800 border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option, i) => (
            <li
              key={i}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-teal-600 hover:text-white cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
