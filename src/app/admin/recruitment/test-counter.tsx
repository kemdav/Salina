"use client";
import { useState } from "react";

export function TestCounter() {
  const [count, setCount] = useState(0);
  return (
    <div className="mb-4">
      <button 
        onClick={() => setCount(c => c + 1)} 
        className="px-4 py-2 bg-red-600 text-white rounded font-bold"
      >
        TEST COUNTER: {count}
      </button>
    </div>
  );
}
