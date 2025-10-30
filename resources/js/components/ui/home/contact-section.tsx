import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface ContactSectionProps {
  contactRef: React.RefObject<HTMLElement | null>
  contactControls: any
}

export function ContactSection({ contactRef, contactControls }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const adminWhatsApp = '6281918285109'

    const whatsappMessage = `*PESAN DARI WEBSITE ALBIRUNI*

*Nama:* ${formData.name}
*No. HP:* ${formData.phone}
*Subjek:* ${formData.subject}

*Pesan:*
${formData.message}

_Dikirim dari website Albiruni Preschool & Day Care_`

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(whatsappMessage)

    // Buka WhatsApp
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')

    // Reset form
    setFormData({
      name: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" ref={contactRef} className="relative z-20 py-20 px-6 bg-blue-900/30 backdrop-blur-sm">
      <div className="container mx-auto">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
          initial="hidden"
          animate={contactControls}
          className="text-center mb-12"
        >
          <h3 className="text-blue-300 text-xl mb-4">HUBUNGI KAMI</h3>
          <h2 className="text-4xl font-bold text-white mb-6">Siap Bergabung dengan Albiruni?</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
          <p className="text-blue-200 mt-4">Hubungi kami melalui WhatsApp untuk informasi lebih lanjut</p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
            },
          }}
          initial="hidden"
          animate={contactControls}
          className="max-w-3xl mx-auto bg-blue-950/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-blue-200 mb-2">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Nama Anda"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-blue-200 mb-2">
                  No. WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-blue-200 mb-2">
                Subjek <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Misal: Informasi Pendaftaran"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-blue-200 mb-2">
                Pesan <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Tulis pesan Anda di sini..."
              ></textarea>
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Kirim via WhatsApp
            </Button>
            <p className="text-center text-blue-300 text-sm">
              Pesan akan dikirim ke WhatsApp admin kami
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
} 