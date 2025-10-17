import React from "react"

export function StarsBackground() {
  return (
    <div className="absolute inset-0">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-white ${
            i % 5 === 0 ? "w-1 h-1" : i % 3 === 0 ? "w-1.5 h-1.5" : "w-0.5 h-0.5"
          } ${i % 7 === 0 ? "animate-twinkle-slow" : i % 5 === 0 ? "animate-twinkle" : "animate-twinkle-fast"}`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
          }}
        />
      ))}
    </div>
  )
} 