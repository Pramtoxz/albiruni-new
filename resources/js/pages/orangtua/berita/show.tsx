import { Head, Link } from "@inertiajs/react"
import { Calendar, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface News {
  id: number
  title: string
  excerpt: string
  content: string
  image_url: string
  slug: string
  published_at: string
}

interface NewsShowProps {
  news: News
  relatedNews: News[]
}

export default function OrangtuaNewsShow({ news, relatedNews }: NewsShowProps) {
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
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
        <div className="absolute top-20 right-0 w-24 h-24 bg-pink-300 rounded-full opacity-20 translate-x-12"></div>
        <div className="absolute bottom-40 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20"></div>

        {/* Article Content */}
        <div className="pt-12 pb-4 px-4 space-y-4 relative z-10">
          {/* Back Button & Title */}
          <div className="flex items-center gap-3 mb-2">
            <Link href="/orangtua/berita">
              <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">Detail Berita 📰</h1>
            </div>
          </div>
          {/* Featured Image */}
          <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Card */}
          <Card className="border-0 shadow-lg rounded-3xl">
            <CardContent className="p-5">
              <div className="flex items-center text-blue-600 text-sm mb-3 font-medium">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(news.published_at)}
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {news.title}
              </h1>
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                {news.excerpt}
              </p>
              <div className="h-px bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 mb-4"></div>
              <div 
                className="prose prose-sm max-w-none
                  prose-headings:text-gray-800 prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-blue-600 prose-a:font-medium
                  prose-strong:text-gray-800 prose-strong:font-bold
                  prose-ul:text-gray-700
                  prose-ol:text-gray-700
                  prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </CardContent>
          </Card>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Berita Lainnya
              </h2>
              <div className="space-y-3">
                {relatedNews.map((item) => (
                  <Link key={item.id} href={`/orangtua/berita/${item.slug}`}>
                    <Card className="border-0 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                      <CardContent className="p-0">
                        <div className="flex gap-3 p-3">
                          <div className="flex-shrink-0">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-20 h-20 rounded-xl object-cover shadow-sm"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center text-blue-600 text-xs font-medium">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(item.published_at)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
