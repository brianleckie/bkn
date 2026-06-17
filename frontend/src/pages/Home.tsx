import IntroLoader from '../components/home/IntroLoader'
import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import StatsStrip from '../components/home/StatsStrip'
import ServicesAccordion from '../components/home/ServicesAccordion'
import BookingCta from '../components/home/BookingCta'
import Gallery from '../components/home/Gallery'
import Nosotros from '../components/home/Nosotros'
import Contacto from '../components/home/Contacto'
import Footer from '../components/home/Footer'

export default function Home() {
  return (
    <>
      <IntroLoader />
      <Navbar />
      <Hero />
      <StatsStrip />
      <ServicesAccordion />
      <BookingCta />
      <Gallery />
      <Nosotros />
      <Contacto />
      <Footer />
    </>
  )
}
