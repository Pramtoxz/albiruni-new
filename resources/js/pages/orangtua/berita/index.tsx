import { Head, Link } from "@inertiajs/react"
import { Calendar, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface News {
  id: number
  title: string
  excerpt: string
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

export default function OrangtuaNewsIndex({ news }: NewsIndexProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <>
      <Head title="Berita - AL-Biruni" />
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 px-4 py-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Link 
              href="/orangtua/dashboard" 
              className="inline-flex items-center text-white hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Berita & Pengumuman</h1>
          </div>
          <p className="text-sm opacity-90">Kabar terkini dari TK Al-Biruni</p>
        </div>

        {/* News List */}
        <div className="px-4 py-6 space-y-4">
          {news.data.length > 0 ? (
            <>
              {news.data.map((item) => (
                <Link key={item.id} href={`/orangtua/berita/${item.slug}`}>
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                    <CardContent className="p-0">
                      <div className="flex gap-3 p-3">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-24 h-24 rounded-xl object-cover shadow-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-800 line-clamp-2 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {item.excerpt}
                          </p>
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

              {/* Pagination */}
              {news.last_page > 1 && (
                <div className="flex justify-center items-center gap-2 pt-4">
                  {news.links.map((link, index) => {
                    if (!link.url) {
                      return (
                        <span
                          key={index}
                          className="px-3 py-2 rounded-lg bg-gray-200 text-gray-400 text-sm"
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      )
                    }

                    return (
                      <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          link.active
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">📰</div>
                <p className="text-gray-600 font-medium">Belum ada berita yang dipublikasikan</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
