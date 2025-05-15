"use client"

import { useState, useEffect, type ReactNode } from "react"

interface ScrollHeaderProps {
  children: ReactNode
}

export default function ScrollHeader({ children }: ScrollHeaderProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  let scrollTimer: NodeJS.Timeout | null = null

  const controlHeader = () => {
    const currentScrollY = window.scrollY

    // 스크롤 방향 감지
    const isScrollingDown = currentScrollY > lastScrollY
    const isScrollingUp = currentScrollY < lastScrollY

    // 스크롤 중임을 표시
    setIsScrolling(true)

    // 스크롤 타이머 초기화
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }

    // 스크롤 방향에 따라 헤더 표시/숨김
    if (isScrollingDown) {
      setIsVisible(false)
    } else if (isScrollingUp) {
      setIsVisible(true)
    }

    // 스크롤이 멈추면 헤더 표시
    scrollTimer = setTimeout(() => {
      setIsScrolling(false)
      setIsVisible(true)
    }, 150) // 스크롤이 멈춘 후 150ms 후에 헤더 표시

    setLastScrollY(currentScrollY)
  }

  useEffect(() => {
    window.addEventListener("scroll", controlHeader)

    return () => {
      window.removeEventListener("scroll", controlHeader)
      if (scrollTimer) {
        clearTimeout(scrollTimer)
      }
    }
  }, [lastScrollY])

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {children}
    </div>
  )
}
