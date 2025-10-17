import React from "react"
import { motion, AnimationControls } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ContactSectionProps {
  contactRef: React.RefObject<HTMLElement | null>
  contactControls: AnimationControls
}

export function ContactSection({ contactRef, contactControls }: ContactSectionProps) {
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
          <h3 className="text-blue-300 text-xl mb-4">GET IN TOUCH</h3>
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Space Adventure?</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
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
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-blue-200 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-blue-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-blue-200 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Subject"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-blue-200 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Your message"
              ></textarea>
            </div>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 text-lg">
              Send Message
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
} 