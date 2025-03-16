"use client"

import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function useDrag({ onSwipeLeft, onSwipeRight, threshold = 100 }) {
  const [startX, setStartX] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const isMobile = useMobile()

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    setOffsetX(currentX - startX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    if (offsetX > threshold) {
      onSwipeLeft()
    } else if (offsetX < -threshold) {
      onSwipeRight()
    }

    setIsDragging(false)
    setOffsetX(0)
  }

  const handleMouseDown = (e) => {
    if (isMobile) return
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || isMobile) return
    const currentX = e.clientX
    setOffsetX(currentX - startX)
  }

  const handleMouseUp = () => {
    if (!isDragging || isMobile) return

    if (offsetX > threshold) {
      onSwipeLeft()
    } else if (offsetX < -threshold) {
      onSwipeRight()
    }

    setIsDragging(false)
    setOffsetX(0)
  }

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isMobile])

  const handlers = isMobile
    ? {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
      }
    : {
        onMouseDown: handleMouseDown,
      }

  const style = {
    transform: `translateX(${offsetX}px)`,
    opacity: Math.max(0.5, 1 - Math.abs(offsetX) / 500),
  }

  return { handlers, style }
}

