import React from "react"
import { motion, AnimationControls } from "framer-motion"
import { Telescope, Rocket, Star } from "lucide-react"

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLElement | null>
  featuresControls: AnimationControls
}

export function FeaturesSection({ featuresRef, featuresControls }: FeaturesSectionProps) {
  return (
    <section id="features" ref={featuresRef} className="relative z-20 py-20 px-6">
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
          animate={featuresControls}
          className="text-center mb-16"
        >
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-blue-300 text-xl mb-4"
          >
            OUR PROGRAM
          </motion.h3>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-4xl font-bold text-white mb-6"
          >
            Cosmic Learning Adventures
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
          animate={featuresControls}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<Telescope className="w-12 h-12 text-yellow-400" />}
            title="Space Discovery"
            description="Our little astronauts learn about planets, stars, and galaxies through playful activities designed for kindergarten explorers."
          />
          <FeatureCard
            icon={<Rocket className="w-12 h-12 text-orange-400" />}
            title="Play & Learn"
            description="Develop essential kindergarten skills through space-themed games, puzzles, and hands-on activities that make learning fun."
          />
          <FeatureCard
            icon={<Star className="w-12 h-12 text-blue-300" />}
            title="Creative Expression"
            description="Express creativity through art, music, and storytelling in our cosmic kindergarten where imagination knows no bounds."
          />
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-2 group"
    >
      <div className="bg-blue-800/50 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-700/70 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>
      <p className="text-blue-200 text-center">{description}</p>
    </motion.div>
  )
} 