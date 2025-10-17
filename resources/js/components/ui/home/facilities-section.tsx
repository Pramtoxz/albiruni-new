import React from "react"
import { motion, AnimationControls } from "framer-motion"
import { Star, Rocket, Moon, Telescope } from "lucide-react"
import Kepsek from "@/assets/guru/kepala.png"
interface FacilitiesSectionProps {
  activitiesControls: AnimationControls
}

export function FacilitiesSection({ activitiesControls }: FacilitiesSectionProps) {
  return (
    <section id="facilities" className="relative z-20 py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
          initial="hidden"
          animate={activitiesControls}
          className="text-center mb-16"
        >
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-blue-300 text-xl mb-4"
          >
            FASILITAS KAMI
          </motion.h3>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-4xl font-bold text-white mb-6"
          >
            Ruang Belajar Kosmik untuk Si Kecil
          </motion.h2>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="w-24 h-1 bg-yellow-500 mx-auto"
          ></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
            animate={activitiesControls}
            className="space-y-6"
          >
            <FacilityItem
              icon={<Star className="w-6 h-6 text-yellow-400" />}
              title="Ruang Kelas Tematik"
              description="Ruang kelas dengan dekorasi luar angkasa yang membuat anak-anak merasa seperti belajar di dalam pesawat luar angkasa."
            />
            <FacilityItem
              icon={<Rocket className="w-6 h-6 text-orange-400" />}
              title="Taman Bermain Kosmik"
              description="Area bermain outdoor dengan struktur permainan berbentuk roket, planet, dan wahana luar angkasa lainnya."
            />
            <FacilityItem
              icon={<Moon className="w-6 h-6 text-blue-200" />}
              title="Planetarium Mini"
              description="Ruangan khusus dengan proyeksi bintang-bintang dan planet untuk pengalaman belajar yang imersif."
            />
            <FacilityItem
              icon={<Telescope className="w-6 h-6 text-purple-400" />}
              title="Laboratorium Sains Kecil"
              description="Area untuk eksperimen sains sederhana yang aman dan menyenangkan untuk anak-anak usia TK."
            />
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
            animate={activitiesControls}
            className="relative"
          >
            <div className="bg-blue-900/50 backdrop-blur-sm rounded-2xl p-2 border border-blue-700/50 relative overflow-hidden">
              <img
                src={Kepsek}
                alt="Kindergarten space-themed classroom"
                width={600}
                height={500}
                className="rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              {/* <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-lg font-bold">
                  "With a heart for education and a vision for excellence, she leads our little learners on a journey of discovery, creativity, and growth. 🌱📚"
                </p>
              </div> */}
            </div>
            <div className="absolute -top-6 -right-6 bg-yellow-500 rounded-full p-4 shadow-lg">
              <Rocket className="w-8 h-8 text-blue-900" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

interface FacilityItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FacilityItem({ icon, title, description }: FacilityItemProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="bg-blue-800/50 rounded-full p-3 flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-blue-200">{description}</p>
      </div>
    </div>
  )
} 