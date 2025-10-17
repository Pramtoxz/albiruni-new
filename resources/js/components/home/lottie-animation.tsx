import { useEffect, useRef, useState } from "react"
import lottie from "lottie-web"
import { useScroll, motion, useTransform, useSpring } from "framer-motion"

interface LottieAnimationProps {
  animationData?: Record<string, unknown>
  lottieUrl?: string
  className?: string
}

export function LottieAnimation({ animationData, lottieUrl, className = "" }: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<ReturnType<typeof lottie.loadAnimation> | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize the animation
  useEffect(() => {
    if (!containerRef.current) return

    // If we have animation data directly
    if (animationData) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      })
      setIsLoaded(true)
      return
    }

    // If we have a URL to the animation data
    if (lottieUrl) {
      // For now, we'll just show a placeholder message
      // In a real implementation, you would fetch the JSON from the URL
      console.log("Lottie URL provided:", lottieUrl)
      setIsLoaded(true)
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
      }
    }
  }, [animationData, lottieUrl])

  return (
    <div ref={containerRef} className={`lottie-container ${className}`}>
      {!isLoaded && <div className="w-full h-full bg-blue-900/20 animate-pulse rounded-full"></div>}
    </div>
  )
}

export function ScrollLottieAnimation({ animationData, lottieUrl, className = "" }: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  // Create a smoother version of scrollYProgress
  const smoothProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 100 })

  // Transform the scroll progress to a scale value that goes from 1 to 1.5 and back to 1
  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [1, 1.5, 1.5, 1])

  // Also add a slight rotation based on scroll
  const rotate = useTransform(smoothProgress, [0, 0.5, 1], [0, 15, 0])

  // And a subtle y-position change
  const y = useTransform(smoothProgress, [0, 0.5, 1], [0, -30, 0])

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, rotate, y }}
      className={`fixed z-10 pointer-events-none ${className}`}
    >
      <LottieAnimation animationData={animationData} lottieUrl={lottieUrl} />
    </motion.div>
  )
}
