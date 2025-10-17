import React from "react"
import { motion, AnimationControls } from "framer-motion"
import { Button } from "@/components/ui/button"
import Logo from '@/assets/home/logoalbiruni.webp'

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement | null>
  heroControls: AnimationControls
}

export function HeroSection({ heroRef, heroControls }: HeroSectionProps) {
  return (
    <section id="home" ref={heroRef} className="relative z-20 pt-16 md:pt-20 pb-24 md:pb-32 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="relative mb-6 md:mb-8 flex justify-center">
          <div className="w-40 h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 relative">
            <img
              src={Logo}
              alt="Logo Albiruni"
              className="w-full h-full object-contain scale-200"
            />
          </div>
        </div>
        
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
          initial="hidden"
          animate={heroControls}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-8 md:mb-10 px-2 md:px-4">
            <span className="text-xl md:text-2xl font-bold text-yellow-300 block mb-2 md:mb-3">Al-Biruni Preschool & Daycare</span> menyediakan layanan pendidikan holistik untuk anak usia 1-6 tahun. Program kami mencakup <span className="text-blue-300 font-semibold">💙 Baby Class</span> (1-2 tahun) untuk perkembangan sensorik dan motorik awal, <span className="text-blue-300 font-semibold">🤍 Preschool</span> (2-4 tahun) yang menekankan keterampilan sosial dan bahasa, serta <span className="text-blue-300 font-semibold">💛 Kindergarten</span> (4-6 tahun) yang mempersiapkan anak untuk kesuksesan akademis melalui eksplorasi yang menyenangkan dan pembelajaran berbasis proyek.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 text-base md:text-lg rounded-full">
              Mulai Perjalanan
            </Button>
            <Button
              variant="outline"
              className="border-blue-400 text-blue-200 hover:bg-blue-900/30 px-5 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 text-base md:text-lg rounded-full"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 