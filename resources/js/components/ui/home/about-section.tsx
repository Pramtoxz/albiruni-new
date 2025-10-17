import React from "react"
import { motion, AnimationControls } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Kami from "@/assets/home/kami.jpg"

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLElement | null>
  aboutControls: AnimationControls
}

export function AboutSection({ aboutRef, aboutControls }: AboutSectionProps) {
  return (
    <section id="about" ref={aboutRef} className="relative z-20 py-16 md:py-20 px-4 md:px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            initial="hidden"
            animate={aboutControls}
            className="relative"
          >
            <div className="bg-blue-900/50 backdrop-blur-sm rounded-2xl p-2 border border-blue-700/50">
              <img
                src={Kami}
                alt="Children learning about space"
                width={600}
                height={500}
                className="rounded-xl w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-yellow-500 rounded-full p-3 md:p-4 shadow-lg">
              <Star className="w-6 h-6 md:w-8 md:h-8 text-blue-900" />
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
              },
            }}
            initial="hidden"
            animate={aboutControls}
            className="pt-4 md:pt-0"
          >
            <h3 className="text-blue-300 text-lg md:text-xl mb-3 md:mb-4">TENTANG KAMI</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">TK Luar Angkasa untuk Bintang Kecil</h2>
            <div className="w-20 md:w-24 h-1 bg-yellow-500 mb-6 md:mb-8"></div>
            <p className="text-sm md:text-base text-blue-100 mb-4 md:mb-6 leading-relaxed">
              Di Al-Biruni Preschool & Daycare, kami menyediakan pendidikan berkualitas untuk anak usia 1-6 tahun melalui tiga program utama: <span className="text-yellow-300 font-semibold">💙 Baby Class</span> yang penuh kasih sayang untuk usia 1-2 tahun, <span className="text-yellow-300 font-semibold">🤍 Preschool</span> yang interaktif untuk usia 2-4 tahun, dan <span className="text-yellow-300 font-semibold">💛 Kindergarten</span> yang menginspirasi untuk usia 4-6 tahun.
            </p>
            <p className="text-sm md:text-base text-blue-100 mb-6 md:mb-8 leading-relaxed">
              Pendidik berpengalaman kami menciptakan lingkungan yang aman dan mendukung di mana anak-anak dapat mengembangkan keterampilan sensorik, bahasa, sosial, literasi dan matematika dalam suasana yang menyenangkan. Kurikulum kami dirancang untuk menumbuhkan rasa ingin tahu dan kecintaan belajar sejak usia dini.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 md:px-6 md:py-4 text-sm md:text-base">Pelajari Lebih Lanjut</Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 