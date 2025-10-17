import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function FloatingElements() {
  const [elements, setElements] = useState<
    { id: number; x: number; y: number; size: number; delay: number; duration: number }[]
  >([])

  useEffect(() => {
    // Generate random elements
    const newElements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 20,
      delay: Math.random() * 2,
      duration: Math.random() * 5 + 5,
    }))
    setElements(newElements)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, element.id % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {element.id % 4 === 0 ? (
            <Star className="text-yellow-300 opacity-60" style={{ width: element.size, height: element.size }} />
          ) : element.id % 4 === 1 ? (
            <div
              className="rounded-full bg-blue-400 opacity-40"
              style={{ width: element.size / 2, height: element.size / 2 }}
            />
          ) : element.id % 4 === 2 ? (
            <div className="w-10 h-10 text-orange-300 opacity-50" style={{ width: element.size, height: element.size }}>
              🚀
            </div>
          ) : (
            <div className="w-10 h-10 text-green-300 opacity-50" style={{ width: element.size, height: element.size }}>
              👨‍🚀
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export function KindergartenDoodles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5 opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="doodle-pattern" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
            {/* Simple rocket doodle */}
            <path d="M50,50 L60,30 L70,50 L60,80 Z" stroke="white" fill="none" strokeWidth="2" />

            {/* Simple star doodle */}
            <path
              d="M150,50 L160,30 L170,50 L190,60 L170,70 L160,90 L150,70 L130,60 Z"
              stroke="white"
              fill="none"
              strokeWidth="2"
            />

            {/* Simple planet doodle */}
            <circle cx="250" cy="70" r="20" stroke="white" fill="none" strokeWidth="2" />
            <ellipse cx="250" cy="70" rx="25" ry="10" stroke="white" fill="none" strokeWidth="2" />

            {/* Simple astronaut doodle */}
            <circle cx="70" cy="150" r="15" stroke="white" fill="none" strokeWidth="2" />
            <rect x="60" y="165" width="20" height="30" rx="5" stroke="white" fill="none" strokeWidth="2" />

            {/* Simple telescope doodle */}
            <path d="M150,150 L190,130 L200,140 L160,160 Z" stroke="white" fill="none" strokeWidth="2" />
            <line x1="150" y1="150" x2="140" y2="160" stroke="white" strokeWidth="2" />

            {/* Simple moon doodle */}
            <path
              d="M250,150 A20,20 0 0,1 270,170 A20,20 0 0,1 250,190 A15,20 0 0,0 250,150"
              stroke="white"
              fill="none"
              strokeWidth="2"
            />

            {/* Simple alphabet blocks */}
            <rect x="50" y="220" width="25" height="25" rx="3" stroke="white" fill="none" strokeWidth="2" />
            <text x="57" y="237" fill="white" fontSize="16">
              A
            </text>

            <rect x="90" y="220" width="25" height="25" rx="3" stroke="white" fill="none" strokeWidth="2" />
            <text x="97" y="237" fill="white" fontSize="16">
              B
            </text>

            <rect x="130" y="220" width="25" height="25" rx="3" stroke="white" fill="none" strokeWidth="2" />
            <text x="137" y="237" fill="white" fontSize="16">
              C
            </text>

            {/* Simple crayon */}
            <path d="M200,220 L220,240 L225,235 L205,215 Z" stroke="white" fill="none" strokeWidth="2" />

            {/* Simple teddy bear */}
            <circle cx="250" cy="220" r="15" stroke="white" fill="none" strokeWidth="2" />
            <circle cx="240" cy="213" r="5" stroke="white" fill="none" strokeWidth="2" />
            <circle cx="260" cy="213" r="5" stroke="white" fill="none" strokeWidth="2" />
            <path d="M245,225 A5,5 0 0,0 255,225" stroke="white" fill="none" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#doodle-pattern)" />
      </svg>
    </div>
  )
}

export function ChildrenQuotes() {
  const quotes = [
    "Aku ingin jadi astronot dan pergi ke bulan!",
    "Planet favoritku adalah Saturnus karena punya cincin!",
    "Bintang-bintang itu seperti lampu di langit!",
    "Aku suka menggambar roket dan alien!",
    "Di luar angkasa kita bisa melayang seperti burung!",
  ]

  return (
    <div className="py-8">
      <div className="flex overflow-x-hidden relative">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {quotes.concat(quotes).map((quote, index) => (
            <div
              key={index}
              className="inline-block mx-4 px-6 py-3 bg-blue-800/40 backdrop-blur-sm rounded-lg border border-blue-700/50"
            >
              <p className="text-blue-100 italic">"{quote}"</p>
              <p className="text-yellow-300 text-sm mt-2">- Anak TK Al-Biruni</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
