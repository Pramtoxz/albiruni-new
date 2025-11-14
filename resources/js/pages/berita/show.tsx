import { Head, Link } from "@inertiajs/react"
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

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

interface NewsShowProps {
  news: News
  relatedNews: News[]
}

export default function NewsShow({ news, relatedNews }: NewsShowProps) {
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
      <Head title={`${news.title} - AL-Biruni`} />
      
      <div className="min-h-screen bg-gradient-to-b from-[#020b2d] via-[#041254] to-[#020b2d]" style={{ background: 'linear-gradient(to bottom, #020b2d, #041254, #020b2d)' }}>
        {/* Header */}
        <header className="relative z-50 border-b border-blue-800/50 bg-blue-900/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/berita" 
                className="inline-flex items-center text-white hover:text-yellow-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali ke Berita
              </Link>
              <Link 
                href="/" 
                className="text-white hover:text-yellow-300 transition-colors"
              >
                Beranda
              </Link>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="relative z-20 py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Featured Image */}
              <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent"></div>
              </div>

              {/* Article Header */}
              <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50 mb-8">
                <div className="flex items-center text-white text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(news.published_at)}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {news.title}
                </h1>
                <p className="text-xl text-white">
                  {news.excerpt}
                </p>
              </div>

              {/* Article Body */}
              <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50 mb-12">
                <style>{`
                  .article-content,
                  .article-content *,
                  .article-content p,
                  .article-content div,
                  .article-content span,
                  .article-content li,
                  .article-content td,
                  .article-content th {
                    color: white !important;
                  }
                  .article-content a,
                  .article-content a * {
                    color: #fcd34d !important;
                  }
                  .article-content h1,
                  .article-content h2,
                  .article-content h3,
                  .article-content h4,
                  .article-content h5,
                  .article-content h6,
                  .article-content h1 *,
                  .article-content h2 *,
                  .article-content h3 *,
                  .article-content h4 *,
                  .article-content h5 *,
                  .article-content h6 * {
                    color: white !important;
                    font-weight: bold !important;
                  }
                  .article-content strong,
                  .article-content b {
                    color: white !important;
                  }
                `}</style>
                <div 
                  className="article-content prose prose-invert prose-lg max-w-none
                    prose-headings:text-white 
                    prose-p:text-white 
                    prose-a:text-yellow-300 
                    prose-strong:text-white
                    prose-ul:text-white
                    prose-ol:text-white
                    prose-li:text-white"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>
            </motion.div>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Berita Lainnya
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNews.map((item) => (
                    <Link key={item.id} href={`/berita/${item.slug}`}>
                      <div className="bg-blue-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all hover:transform hover:-translate-y-2 group h-full">
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center text-white text-xs mb-2">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(item.published_at)}
                          </div>
                          <h3 className="text-white font-semibold line-clamp-2 group-hover:text-yellow-300 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link 
                    href="/berita"
                    className="inline-flex items-center bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-xl transition-all hover:transform hover:-translate-y-1"
                  >
                    Lihat Semua Berita
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </article>

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
