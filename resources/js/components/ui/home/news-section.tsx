import { motion, useAnimation } from "framer-motion"
import { Calendar, ArrowRight } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

interface News {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  image_url: string
  slug: string
  published_at: string
}

interface NewsSectionProps {
  latestNews: News
  otherNews: News[]
}

export function NewsSection({ latestNews, otherNews }: NewsSectionProps) {
  const newsRef = useRef<HTMLElement>(null)
  const newsInView = useInView(newsRef, { once: true })
  const newsControls = useAnimation()

  useEffect(() => {
    if (newsInView) {
      newsControls.start("visible")
    }
  }, [newsInView, newsControls])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <section id="news" ref={newsRef} className="relative z-20 py-20 px-6 bg-blue-900/20 backdrop-blur-sm">
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
          animate={newsControls}
          className="text-center mb-16"
        >
          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-blue-300 text-xl mb-4"
          >
            BERITA TERBARU
          </motion.h3>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-4xl font-bold text-white mb-6"
          >
            Kabar Terkini dari Al-Biruni
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
          animate={newsControls}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Featured News - Large Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="lg:col-span-2"
          >
            <Link href={`/berita/${latestNews.slug}`}>
              <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-2 group h-full">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={latestNews.image_url}
                    alt={latestNews.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center text-white text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(latestNews.published_at)}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">
                      {latestNews.title}
                    </h3>
                    <p className="text-white mb-4 line-clamp-2">
                      {latestNews.excerpt}
                    </p>
                    <div className="inline-flex items-center text-yellow-300 font-semibold group-hover:text-yellow-400 transition-colors">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Other News - Small Cards */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="space-y-4"
          >
            {otherNews.map((news) => (
              <Link key={news.id} href={`/berita/${news.slug}`}>
                <div className="bg-blue-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-1 group">
                  <div className="flex gap-4 p-4">
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center text-white text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(news.published_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* View All Button */}
            <Link href="/berita">
              <div className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-xl transition-all hover:transform hover:-translate-y-1 text-center group">
                <span className="inline-flex items-center">
                  Lihat Semua Berita
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
