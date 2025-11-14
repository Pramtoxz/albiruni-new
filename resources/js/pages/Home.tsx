import SpaceLanding from "@/components/home/space-landing"
import { Head } from "@inertiajs/react"

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

interface HomeProps {
  latestNews?: News
  otherNews?: News[]
}

export default function Home({ latestNews, otherNews }: HomeProps) {
  return (
    <>
      <Head title="AL-Biruni" />
      <SpaceLanding latestNews={latestNews} otherNews={otherNews} />
    </>
  )
}
