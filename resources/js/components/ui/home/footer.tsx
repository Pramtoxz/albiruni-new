import React from "react"
import { Telescope } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-20 py-8 px-6 border-t border-blue-800/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-blue-600 rounded-full p-2">
              <Telescope className="text-yellow-300 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-blue-300">A</span>
                <span className="text-white">lbiruni</span>
              </h1>
              <p className="text-xs text-blue-200">PRESCHOOL & DAY CARE</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-blue-300 text-sm">
              &copy; {new Date().getFullYear()} Albiruni Preschool & Day Care. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 