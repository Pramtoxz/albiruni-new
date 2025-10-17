import React from "react"
import { useEffect, useRef, useState } from "react"
import { useAnimation, useInView } from "framer-motion"
import { Moon, Rocket } from "lucide-react"
import { FloatingElements, KindergartenDoodles, ChildrenQuotes } from "@/components/home/kindergarten-elements"
import { LottieAnimation, ScrollLottieAnimation } from "@/components/home/lottie-animation"
import RocketAnimation from '@/assets/home/astro.json'
import Mengambang from '@/assets/home/mengambang.json'

// Import komponen yang telah dipisahkan
import { Header } from "@/components/ui/home/header"
import { HeroSection } from "@/components/ui/home/hero-section"
import { FeaturesSection } from "@/components/ui/home/features-section"
import { ActivitiesSection } from "@/components/ui/home/activities-section"
import { FacilitiesSection } from "@/components/ui/home/facilities-section"
import { TeachersSection } from "@/components/ui/home/teachers-section"
import { AboutSection } from "@/components/ui/home/about-section"
import { ContactSection } from "@/components/ui/home/contact-section"
import { Footer } from "@/components/ui/home/footer"
import { StarsBackground } from "@/components/ui/home/stars-background"

export default function SpaceLanding() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  const activitiesRef = useRef<HTMLElement>(null)
  const teachersRef = useRef<HTMLElement>(null)

  const heroInView = useInView(heroRef, { once: true })
  const featuresInView = useInView(featuresRef, { once: true })
  const aboutInView = useInView(aboutRef, { once: true })
  const contactInView = useInView(contactRef, { once: true })
  const activitiesInView = useInView(activitiesRef, { once: true })
  const teachersInView = useInView(teachersRef, { once: true })

  const heroControls = useAnimation()
  const featuresControls = useAnimation()
  const aboutControls = useAnimation()
  const contactControls = useAnimation()
  const activitiesControls = useAnimation()
  const teachersControls = useAnimation()

  useEffect(() => {
    if (heroInView) {
      heroControls.start("visible")
    }
    if (featuresInView) {
      featuresControls.start("visible")
    }
    if (activitiesInView) {
      activitiesControls.start("visible")
    }
    if (teachersInView) {
      teachersControls.start("visible")
    }
    if (aboutInView) {
      aboutControls.start("visible")
    }
    if (contactInView) {
      contactControls.start("visible")
    }
  }, [
    heroInView,
    featuresInView,
    activitiesInView,
    teachersInView,
    aboutInView,
    contactInView,
    heroControls,
    featuresControls,
    activitiesControls,
    teachersControls,
    aboutControls,
    contactControls,
  ])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const calculateParallax = (depth: number) => {
    const x = (window.innerWidth / 2 - mousePosition.x) * depth
    const y = (window.innerHeight / 2 - mousePosition.y) * depth
    return `translate(${x}px, ${y}px)`
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#020b2d] via-[#041254] to-[#020b2d]">
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <StarsBackground />
      </div>

      <KindergartenDoodles />
      <FloatingElements />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-80 z-10" style={{ transform: calculateParallax(0.02) }}>
        <LottieAnimation
          animationData={Mengambang}
          className="w-full h-full animate-float-slow"
        />
      </div>
      <ScrollLottieAnimation
        animationData={RocketAnimation}
        className="sm:fixed sm:top-20 sm:right-10 w-64 h-64 md:w-96 md:h-96 xl:w-[500px] xl:h-[500px] absolute -bottom-10 left-1/2 transform -translate-x-1/2 sm:translate-x-0"
      />

      <div className="absolute bottom-40 left-1/4 opacity-80 z-10" style={{ transform: calculateParallax(0.01) }}>
        <Moon className="text-yellow-200 w-20 h-20 animate-float" />
      </div>

      <div className="absolute bottom-60 right-1/4 opacity-80 z-10" style={{ transform: calculateParallax(0.015) }}>
        <Rocket className="text-orange-400 w-12 h-12 animate-rocket" />
      </div>

      {/* Menggunakan komponen yang telah dipisahkan */}
      <Header />
      <HeroSection heroRef={heroRef} heroControls={heroControls} />
      <ChildrenQuotes />
      <FeaturesSection featuresRef={featuresRef} featuresControls={featuresControls} />
      <ActivitiesSection activitiesRef={activitiesRef} activitiesControls={activitiesControls} />
      <FacilitiesSection activitiesControls={activitiesControls} />
      <TeachersSection teachersRef={teachersRef} teachersControls={teachersControls} />
      <AboutSection aboutRef={aboutRef} aboutControls={aboutControls} />
      <ContactSection contactRef={contactRef} contactControls={contactControls} />
      <Footer />
    </div>
  )
}
