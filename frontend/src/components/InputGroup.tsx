"use client";

import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  id: string;
}

export default function InputGroup({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix,
  suffix,
  tooltip,
  id
}: InputGroupProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="text-sm font-semibold text-gray-700 flex items-center">
          {label}
          {tooltip && (
            <span className="ml-2 group relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1">
          {prefix && <span className="text-gray-500 text-sm mr-1">{prefix}</span>}
          <input
            type="number"
            id={id}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
            className="bg-transparent text-sm font-bold text-primary-blue w-20 outline-none text-right"
            aria-label={`${label} input`}
          />
          {suffix && <span className="text-gray-500 text-sm ml-1">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        id={`${id}-slider`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        className="slider-thumb"
        aria-label={`${label} slider`}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400 font-medium">{prefix}{min}{suffix}</span>
        <span className="text-[10px] text-gray-400 font-medium">{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}
