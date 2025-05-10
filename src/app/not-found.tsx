import Link from 'next/link'
import Image from 'next/image'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      {/* 404 Text with Shadow Effect */}
      <Image
            src={"/resources/images/404.png"}
            alt={"imagen de error 404"}
            className=" bg-white"
            width={380}
            height={380}
            />
      
      {/* Page Missing Text */}
      <h2 className="text-2xl font-semibold text-gray-700 mt-4 mb-2">
        Pagina no encontrada!
      </h2>
      
      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        Pero no te preocupes! Estamos trabajando en ello.
      </p>
      
      {/* Go Home Button */}
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
      >
        Ir a la página principal
      </Link>
      
      {/* Ostrich Illustration */}
          <Image
            src={"/resources/images/404-illustration.png"}
            alt={"imagen de error 404"}
            className=" bg-white"
            width={380}
            height={380}
            />
      <div className="mt-12 w-full max-w-md">
      
        
      </div>
    </div>
  )
}

