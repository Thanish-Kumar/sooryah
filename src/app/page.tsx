import SunscreenApp from '../components/SunscreenApp'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <h1 className="text-6xl font-extrabold text-center text-yellow-600 mb-2">SOORYAH!!</h1>
      <p className="text-center text-gray-700 text-lg mb-8">Calculate your optimal sunlight exposure required for daily dose of vitamin D</p>
      <SunscreenApp />
      <footer className="mt-auto py-8 text-center">
        <p className="text-lg font-medium mb-2">A tribute to sun, Happy Pongal !!</p>
        <p className="text-sm text-gray-600">
          Made with ❤️ by{' '}
          <a 
            href="https://github.com/Thanish-Kumar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Thanish
          </a>
          {' '}and Akesh
        </p>
      </footer>
    </div>
  )
}

