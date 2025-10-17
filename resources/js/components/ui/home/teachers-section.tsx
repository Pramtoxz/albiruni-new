import React from "react"
import { motion, AnimationControls } from "framer-motion"
import Suci from "@/assets/guru/suci.webp"
import Aurora from "@/assets/guru/aurora.webp"
import Ayu from "@/assets/guru/ayu.webp"
import Mesi from "@/assets/guru/mesi.webp"
import Oliv from "@/assets/guru/oliv.webp"
import Pit from "@/assets/guru/pit.webp"
import Putri from "@/assets/guru/putri.webp"
import Rifa from "@/assets/guru/rifa.webp"
import Yossi from "@/assets/guru/yossi.webp"

interface TeachersSectionProps {
  teachersRef: React.RefObject<HTMLElement | null>
  teachersControls: AnimationControls
}

export function TeachersSection({ teachersRef, teachersControls }: TeachersSectionProps) {
  return (
    <section id="teachers" ref={teachersRef} className="relative z-20 py-16 md:py-20 px-4 md:px-6">
      <div className="container max-w-7xl mx-auto">
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
          animate={teachersControls}
          className="text-center mb-10 md:mb-16"
        >
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-blue-300 text-lg md:text-xl mb-3 md:mb-4"
          >
            TIM PENGAJAR
          </motion.h3>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6"
          >
            Guru-Guru Luar Biasa Kami
          </motion.h2>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="w-20 md:w-24 h-1 bg-yellow-500 mx-auto"
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
          animate={teachersControls}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          <TeacherCard
            image={Suci}
            name="Suci"
            role="Guru Pendamping Belajar"
            description="From playful moments to valuable lessons! 🎉📖 Aunt Suci ensures every child enjoys learning at Al Biruni Preschool! 🌈🚀"
          />
          <TeacherCard
            image={Aurora}
            name="Aurora"
            role="Guru Kreatif & Inspiratif"
            description="Meet Aunt Aurora! 🌟With her warm smile and passion for teaching, Aunty Aurora is here to make learning fun and exciting for our little ones at Al Biruni Preschool & Daycare! 🎨📚✨"
          />
          <TeacherCard
            image={Ayu}
            name="Ayu"
            role="Guru Olahraga & Aktivitas Fisik"
            description=" Meet Aunt Ayu! 🏀🎾With a passion for sports and education, Aunt Ayu is here to keep our little learners active, happy, and healthy! 🌟💪"
          />
          <TeacherCard
            image={Mesi}
            name="Mesi"
            role="Guru Penyambut"
            description="Exciting lessons, happy faces, and a bright future ahead! ✨📚 Aunt Mesi welcomes little learners to Al Biruni Preschool! 🏫💖"
          />
          <TeacherCard
            image={Oliv}
            name="Oliv"
            role="Guru Nutrisi & Gaya Hidup Sehat"
            description="🍉 Meet Aunt Olivia! 🍉✨Bringing health and happiness to our little learners, Aunt Oliv is here to teach the importance of good nutrition and a balanced lifestyle! 🥦🥕💖"
          />
          <TeacherCard
            image={Pit}
            name="Pit"
            role="Guru Seni & Kreativitas"
            description="A great teacher can change a child's world! 🌎�� Meet Aunt Pit, who brings passion and creativity into every lesson! 🎨📖"
          />
          <TeacherCard
            image={Putri}
            name="Putri"
            role="Guru Pengembangan Lingkungan Belajar"
            description="Because learning should always be fun! 😃📖 Aunt Putri creates an engaging environment for young minds to grow! 🌟💡"
          />
          <TeacherCard
            image={Rifa}
            name="Rifa"
            role="Guru Pendamping Perjalanan Edukasi"
            description="Making every day a fun learning experience! 🎉📚 Aunt Rifa is ready to guide your little ones through an exciting educational journey! 🚀💖"
          />
          <TeacherCard
            image={Yossi}
            name="Yossi"
            role="Guru Dasar ABC & 123"
            description="From ABCs to 123s, Aunt Yosi is here to make learning magical! ✨📚 Join us at Al Biruni Preschool & Daycare for a fun-filled journey! 🚀👩‍🏫"
          />
        </motion.div>
      </div>
    </section>
  )
}

interface TeacherCardProps {
  image: string
  name: string
  role: string
  description: string
}

function TeacherCard({ image, name, role, description }: TeacherCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-blue-900/30 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-2 group"
    >
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
          <h3 className="text-lg md:text-xl font-bold text-white">{name}</h3>
          <p className="text-yellow-300 text-xs md:text-sm">{role}</p>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <p className="text-blue-200 text-sm md:text-base">{description}</p>
        <div className="flex gap-2 md:gap-3 mt-3 md:mt-4">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-800/70 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-200"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </div>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-800/70 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-200"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </div>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-800/70 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-200"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 