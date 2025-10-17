import React from "react"
import { motion, AnimationControls } from "framer-motion"
import Satu from "@/assets/kegiatan/1.webp"
import Dua from "@/assets/kegiatan/2.webp"
import Tiga from "@/assets/kegiatan/3.webp"
import Empat from "@/assets/kegiatan/4.webp"
import Lima from "@/assets/kegiatan/5.webp"
import Enam from "@/assets/kegiatan/6.webp"

interface ActivitiesSectionProps {
  activitiesRef: React.RefObject<HTMLElement | null>
  activitiesControls: AnimationControls
}

export function ActivitiesSection({ activitiesRef, activitiesControls }: ActivitiesSectionProps) {
  return (
    <section id="activities" ref={activitiesRef} className="relative z-20 py-20 px-6 bg-blue-900/20 backdrop-blur-sm">
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
            KEGIATAN KAMI
          </motion.h3>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-4xl font-bold text-white mb-6"
          >
            Petualangan Belajar yang Menyenangkan
          </motion.h2>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="w-24 h-1 bg-yellow-500 mx-auto"
          ></motion.div>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.5,
              },
            },
          }}
          initial="hidden"
          animate={activitiesControls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <ActivityCard
            image={Satu}
            title="Astronaut Playtime"
            date="Setiap Senin"
            description="Anak-anak bermain peran sebagai astronaut dengan kostum dan peralatan yang menyerupai penjelajah luar angkasa sungguhan."
          />
          <ActivityCard
           image={Dua}
            title="Seni & Kerajinan Kosmik"
            date="Setiap Selasa"
            description="Membuat kerajinan tangan bertema luar angkasa seperti roket, planet, dan bintang dengan berbagai bahan yang aman untuk anak-anak."
          />
          <ActivityCard
           image={Tiga}
            title="Cerita Petualangan Luar Angkasa"
            date="Setiap Rabu"
            description="Waktu bercerita interaktif dengan buku-buku bergambar tentang luar angkasa dan petualangan kosmik yang menakjubkan."
          />
          <ActivityCard
           image={Empat}
            title="Musik & Gerakan Galaksi"
            date="Setiap Kamis"
            description="Bernyanyi dan menari dengan lagu-lagu bertema luar angkasa untuk mengembangkan keterampilan motorik dan ekspresi diri."
          />
          <ActivityCard
           image={Lima}
            title="Bermain & Belajar Matematika"
            date="Setiap Jumat"
            description="Belajar konsep matematika dasar melalui permainan menghitung bintang, mengelompokkan planet, dan aktivitas menyenangkan lainnya."
          />
          <ActivityCard
           image={Enam}
            title="Eksplorasi Alam Semesta"
            date="Bulanan"
            description="Kunjungan ke planetarium mini kami di mana anak-anak dapat melihat bintang-bintang dan belajar tentang konstelasi dengan cara yang menyenangkan."
          />
        </motion.div>
      </div>
    </section>
  )
}

interface ActivityCardProps {
  image: string
  title: string
  date: string
  description: string
}

function ActivityCard({ image, title, date, description }: ActivityCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-blue-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-2 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-yellow-500 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
          {date}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-blue-200">{description}</p>
      </div>
    </motion.div>
  )
} 