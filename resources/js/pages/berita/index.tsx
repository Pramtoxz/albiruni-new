import { Head, Link } from "@inertiajs/react"
import { Calendar, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface News {
  id: number
  title: string
  excerpt: string
  image: string
  image_url: string
  slug: string
  published_at: string
}

interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

interface NewsIndexProps {
  news: {
    data: News[]
    links: PaginationLink[]
    current_page: number
    last_page: number
  }
}

export default function NewsIndex({ news }: NewsIndexProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <>
      <Head title="Berita - AL-Biruni" />
      
      <div className="min-h-screen bg-gradient-to-b from-[#020b2d] via-[#041254] to-[#020b2d]" style={{ background: 'linear-gradient(to bottom, #020b2d, #041254, #020b2d)' }}>
        {/* Header */}
        <header className="relative z-50 border-b border-blue-800/50 bg-blue-900/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-white hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-20 py-16 px-6">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-white mb-4">
                Berita Al-Biruni
              </h1>
              <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
              <p className="text-white text-lg max-w-2xl mx-auto">
                Kabar terkini dan informasi seputar kegiatan TK Al-Biruni
              </p>
            </motion.div>
          </div>
        </section>

        {/* News Grid */}
        <section className="relative z-20 py-12 px-6">
          <div className="container mx-auto">
            {news.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {news.data.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Link href={`/berita/${item.slug}`}>
                        <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-2 group h-full">
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent"></div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center text-white text-sm mb-3">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(item.published_at)}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-white line-clamp-3">
                              {item.excerpt}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {news.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    {news.links.map((link, index) => {
                      if (!link.url) {
                        return (
                          <span
                            key={index}
                            className="px-4 py-2 rounded-lg bg-blue-900/30 text-white/50 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        )
                      }

                      return (
                        <Link
                          key={index}
                          href={link.url}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            link.active
                              ? 'bg-yellow-500 text-blue-900 font-bold'
                              : 'bg-blue-900/30 text-white hover:bg-blue-800/50 hover:text-yellow-300'
                          }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-white text-xl">Belum ada berita yang dipublikasikan</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 border-t border-blue-800/50 bg-blue-900/30 backdrop-blur-sm py-8 px-6 mt-20">
          <div className="container mx-auto text-center">
            <p className="text-white">
              © 2024 TK Al-Biruni. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
