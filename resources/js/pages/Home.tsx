import SpaceLanding from "@/components/home/space-landing"
import SEOHead from "@/components/seo/SEOHead"
import StructuredData from "@/components/seo/StructuredData"

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
  const organizationData = {
    name: "Al-Biruni Preschool & Daycare",
    url: "https://albiruni.sch.id/",
    logo: "https://albiruni.sch.id/logo.svg",
    description: "Daycare dan preschool terbaik di Padang untuk anak usia 1-6 tahun dengan program Baby Class, Preschool, dan Kindergarten.",
    priceRange: "$",
    areaServed: "Padang, Sumatera Barat, Indonesia",
    branches: [
      {
        name: "Al-Biruni Preschool & Daycare - Ulak Karang",
        address: {
          streetAddress: "Jl. S. Parman No. 5",
          addressLocality: "Padang",
          addressRegion: "Sumatera Barat",
          postalCode: "25000",
          addressCountry: "ID",
        },
        telephone: "+62-751-7051234",
        geo: {
          latitude: -0.9471,
          longitude: 100.4172,
        },
      },
      {
        name: "Al-Biruni Preschool & Daycare - Marapalam",
        address: {
          streetAddress: "Jl. Marapalam Raya",
          addressLocality: "Padang",
          addressRegion: "Sumatera Barat",
          postalCode: "25000",
          addressCountry: "ID",
        },
        telephone: "+62-751-7051235",
        geo: {
          latitude: -0.9500,
          longitude: 100.4200,
        },
      },
    ],
  }

  return (
    <>
      <SEOHead
        title="Daycare & Preschool Padang - Al-Biruni Sumatera Barat"
        description="Daycare dan preschool terbaik di Padang. Al-Biruni melayani anak usia 1-6 tahun dengan 2 cabang di Ulak Karang dan Marapalam, Sumatera Barat."
        canonical="https://albiruni.sch.id/"
        keywords="daycare padang, preschool padang, day care padang, tk padang, daycare sumatera barat, preschool sumatera barat, daycare ulak karang, daycare marapalam, baby class padang, kindergarten padang"
        ogType="website"
        ogImage="https://albiruni.sch.id/logo.svg"
      />
      <StructuredData type="organization" organizationData={organizationData} />
      <SpaceLanding latestNews={latestNews} otherNews={otherNews} />
    </>
  )
}
