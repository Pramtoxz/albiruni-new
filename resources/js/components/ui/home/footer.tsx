import React from "react"
import { MapPin, Phone } from "lucide-react"
import AlbiLogo from '@/assets/home/albi.svg'

export function Footer() {
  return (
    <footer className="relative z-20 py-12 px-6 border-t border-blue-800/50 bg-blue-950/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <img src={AlbiLogo} alt="Albiruni Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  <span className="text-blue-300">A</span>
                  <span className="text-white">lbiruni</span>
                </h1>
                <p className="text-xs text-blue-200">PRESCHOOL & DAY CARE</p>
              </div>
            </div>
            <p className="text-blue-300 text-sm text-center md:text-left">
              Memberikan pendidikan terbaik untuk masa depan anak-anak Indonesia
            </p>
          </div>

          {/* Cabang Ulak Karang */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-3 text-lg">Cabang Ulak Karang</h3>
            <div className="space-y-2 text-blue-200 text-sm">
              <div className="flex items-start gap-2 justify-center md:justify-start">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-blue-400" />
                <p>Jl. Yogyakarta No.16, Ulak Karang Sel., Kec. Padang Utara, Kota Padang, Sumatera Barat</p>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <a href="tel:08116689022" className="hover:text-yellow-300 transition-colors">
                  0811-6689-022
                </a>
              </div>
            </div>
          </div>

          {/* Cabang Aur Duri */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-3 text-lg">Cabang Aur Duri</h3>
            <div className="space-y-2 text-blue-200 text-sm">
              <div className="flex items-start gap-2 justify-center md:justify-start">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-blue-400" />
                <p>Jl. Marapalam Indah IX No.1, Kubu Marapalam, Kec. Padang Tim., Kota Padang, Sumatera Barat 25125</p>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <a href="tel:08116689022" className="hover:text-yellow-300 transition-colors">
                  0811-6689-022
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-blue-800/50 text-center">
          <p className="text-blue-300 text-sm">
            &copy; {new Date().getFullYear()} Albiruni Preschool & Day Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 