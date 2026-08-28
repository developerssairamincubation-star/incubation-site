"use client";

import React from "react";

export function ScrollContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      onWheel={(e) => {
        // Prevent the global smooth-scroller from hijacking inner scrolls
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}

export default ScrollContainer;
