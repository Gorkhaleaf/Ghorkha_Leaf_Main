"use client"

import React from "react"

interface Props {
  className?: string
}

const ReviewsBackground: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: "#16a34a",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  )
}

export default ReviewsBackground