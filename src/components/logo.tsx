import React from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-12 h-12", className)}
    >
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* Main large wave */}
        <path d="M 40,110 C 40,60 80,30 120,30 C 160,30 180,60 150,90 C 130,110 80,100 80,130 C 80,160 120,170 160,150" />
        
        {/* Inner secondary wave */}
        <path d="M 60,120 C 60,80 90,50 130,50 C 150,50 160,70 140,85 C 120,100 100,95 100,120 C 100,140 120,150 145,135" />
        
        {/* Small inner wave */}
        <path d="M 20,100 C 20,40 70,10 130,10 C 180,10 200,40 170,70 C 150,90 60,80 60,140 C 60,180 110,190 170,165" />
        
        {/* Splash drops */}
        <circle cx="170" cy="25" r="3" fill="currentColor" />
        <circle cx="185" cy="45" r="2" fill="currentColor" />
        <circle cx="140" cy="15" r="2.5" fill="currentColor" />
      </g>
      
      {/* RIU text */}
      <text
        x="100"
        y="190"
        fontFamily="sans-serif"
        fontSize="36"
        fontWeight="300"
        fill="currentColor"
        textAnchor="middle"
        letterSpacing="4"
      >
        RIU
      </text>
    </svg>
  );
}
