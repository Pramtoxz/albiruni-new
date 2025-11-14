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
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 px-4 py-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <Link 
              href="/orangtua/berita" 
              className="inline-flex items-center text-white hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold line-clamp-1">Detail Berita</h1>
          </div>
        </div>

        {/* Article Content */}
        <div className="px-4 py-6">
          {/* Featured Image */}
          <div className="relative h-56 rounded-2xl overflow-hidden mb-4 shadow-lg">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Card */}
          <Card className="border-0 shadow-lg rounded-2xl mb-4">
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
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">
                Berita Lainnya
              </h2>
              <div className="space-y-3">
                {relatedNews.map((item) => (
                  <Link key={item.id} href={`/orangtua/berita/${item.slug}`}>
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all">
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
