"use client";

import { useTheme, ThemeProvider } from "@/context/ThemeContext";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import {useState, useEffect} from 'react'
import { Facebook, Twitter, NotepadText, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'

function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="bg-bgroot min-h-screen w-full">
      <Navbar />
        <Button onClick={toggleTheme}>Cambiar a </Button>
      <Carrusel data={datos} />
      <ConsultarCertificado />
      <Footer />
      {/*<div className="text-center">
        <Label className="text-4xl font-bold text-bgtext">Hola mundo {theme} </Label>
        <Button onClick={toggleTheme}>Cambiar a </Button>
      </div>*/}
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Home/>
    </ThemeProvider>
  );
}

export const ConsultarCertificado = () => {
  const [otp, setOtp] = useState("");
  const handleChange = (value: string) => {
    // Filtra solo números
    const numericValue = value.replace(/\D/g, "");
    setOtp(numericValue);
  };
  return (
    <div className="bg-gray-100 gap-4 text-gray-800 flex flex-col justify-center items-center mx-auto my-[50px] p-8 rounded-lg shadow-lg w-4/5 dark:bg-black">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Consulta de Certificados</h2>
      <p className="text-sm bg-blue-100 text-blue-600 p-2 rounded-md w-[90%] text-center mb-4">
        ¡Atención! Los certificados se solicitan una vez que el voluntario participante culminó con las 3 actividades designadas.
        <br /> Ingrese su número de DNI para consultar los certificados disponibles.
      </p>
      <div className="flex justify-between items-center w-[90%] mb-4">
        <h3 className="text-lg"></h3>
        <div className="w-[60%] flex justify-between items-center space-x-8 mx-auto ">
          <InputOTP maxLength={8} value={otp} onChange={handleChange}>
            <InputOTPGroup className="bg-white" >
              <InputOTPSlot index={0} className="border-blue-900" itemType="number"/>
              <InputOTPSlot index={1} className="border-blue-900" itemType="number"/>
              <InputOTPSlot index={2} className="border-blue-900" inputMode="numeric"/>
              <InputOTPSlot index={3} className="border-blue-900"/>
              <InputOTPSlot index={4} className="border-blue-900"/>
              <InputOTPSlot index={5} className="border-blue-900"/>
              <InputOTPSlot index={6} className="border-blue-900"/>
              <InputOTPSlot index={7} className="border-blue-900"/>
            </InputOTPGroup>
          </InputOTP>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-md transition duration-300"
          >
            Consultar
          </Button>
        </div>
      </div>
      <p className="text-sm bg-yellow-100 text-yellow-600 p-2 rounded-md w-[90%] text-center mb-2">
        Los certificados se entregarán de manera digital a su correo institucional. Si requiere en físico, apersónese a la oficina de la DPSEC.
      </p>
    
      
    </div>
  );
}
export const Navbar = () => {

  return (
    <nav className="bg-white shadow-md">
      <div className="bg-gray-900 w-full mx-auto px-4 sm:px-6 lg:px-8 h-auto flex justify-end items-center">
        <Link
          href="/intranet"
          className="px-3 py-1 rounded-md text-xs text-blue-600 hover:bg-gray-900 hover:text-gray-50 font-thin"
        >
          Intranet
        </Link>
      </div>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src="/resources/images/genseg.png"
                alt="Logo"
                width={35}
                height={35}
                priority
              />
              <p className="text-black px-2 font-thin">
                Gestor de Proyectos de la DPSEC
              </p>
            </div>
          </Link>
          <div className="hidden sm:flex sm:items-center">
            <Link
              href="/actividades"
              className={clsx(
                "px-3 py-2 rounded-md text-center text-sm font-medium w-52 text-gray-700 hover:bg-gray-400 hover:text-gray-700",
                
              )}
            >
              Actividades
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface carruselProps {
  idcarrusel: number;
  img: string;
  titulo?: string | "Default";
  subtitulo?: string | "DEPSEC";
}

interface vectorCarruselProps {
  data: carruselProps[];
}

const datos = [
  {
    idcarrusel: 1,
    img: "/resources/images/fb1.jpg",
    alt: "First slide",
    titulo: "GENSEG",
    subtitulo: "Dpsec",
  },
  {
    idcarrusel: 2,
    img: "/resources/images/fb2.jpg",
    alt: "Second slide",
    titulo: "Gestion Ambiental",
    subtitulo: "Evidencia de la actividad de la que nosotros nos encontramos con todos",
  },
  {
    idcarrusel: 3,
    img: "/resources/images/fb3.jpg",
    alt: "Third slide",
    titulo: "Seguimiento al egresado",
    subtitulo: "Evidencia de las que no estamos, y sobre todo el respeto",
  },
  {
    idcarrusel: 4,
    img: "/resources/images/fb4.jpg",
    alt: "Fourth slide",
    titulo: "Proyección Social y Extensión Cultural",
    subtitulo: "Evidencia de las que no estamos, y sobre todo el respeto",
  },
];

export function Carrusel({ data }: vectorCarruselProps) {
  // Inicializa el estado con el índice del primer carrusel
  const [activeIndex, setActiveIndex] = useState(0); // Usamos índice en lugar de idcarrusel

  // Temporizador para cambiar de imagen automáticamente
  useEffect(() => {
    if (data.length > 1) {
      const timer = setInterval(() => {
        nextSlide(); // Cambiar al siguiente slide automáticamente
      }, 4000);
      
      // Limpiar el temporizador al desmontar el componente
      return () => clearInterval(timer);
    }
  }, [activeIndex, data.length]); // Dependencia también sobre data.length
   // Solo se ejecuta una vez al montar el componente

  // Función para avanzar al siguiente slide
  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % data.length);
  };

  // Función para retroceder al slide anterior
  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + data.length) % data.length);
  };

  // Función para ir a un slide específico
  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative overflow-hidden h-[600px]" id="carouselExampleCaptions">
      {data.map((image, index) => (
        <div
          key={image.idcarrusel}
          className={`absolute inset-0 transition-opacity duration-[2.3s] ease-in-out ${
            index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`} // Cambié a "opacity-100" para hacerlo visible en vez de "bg-opacity-5"
          aria-hidden={index !== activeIndex}
        >
          <img
            src={`${image.img}`}
            alt={image.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
            <h5 className="text-xl font-bold mb-0 text-center bg-slate-500/30">
              {image.titulo}
            </h5>
            <p className="text-sm text-center mb-16 bg-slate-500/30 text-white">
              {image.subtitulo}
            </p>
          </div>
        </div>
      ))}

      {/* Botón para ir al slide anterior */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 z-20 text-white text-opacity-50 hover:text-white p-2 rounded-full"
        onClick={() => {
          prevSlide(); // Cambia al slide anterior
        }}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-9 w-9" />
        <span className="sr-only">Previous</span>
      </button>

      {/* Botón para ir al siguiente slide */}
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-white text-opacity-50 hover:text-white p-2 rounded-full"
        onClick={() => {
          nextSlide(); // Cambia al siguiente slide
        }}
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-9 w-9" />
        <span className="sr-only">Next</span>
      </button>

      {/* Indicadores (botones) para navegar entre los slides */}
      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {data.map((img, index) => (
          <button
            key={img.idcarrusel}
            type="button"
            className={`w-10 h-1 rounded-[11px] ${
              index === activeIndex ? "bg-blue-700" : "bg-blue-400 opacity-50"
            }`}
            onClick={() => goToSlide(index)} // Cambia al slide seleccionado
            aria-label={`Slide ${img.idcarrusel}`}
            aria-current={index === activeIndex ? "true" : "false"}
          ></button>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-colorFooter py-8 mt-10 absolute button-0 font-nunito ">
      <div className="container mx-auto px-4">
        <div className=" w-full flex flex-wrap justify-normal items-start  ">
          
          {/* Sección de descripción */}
          <div className="w-auto md:w-[40%] mb-6 md:mb-0 pr-9">
           <div className="flex justify-around items-center flex-wrap">
            <div><Image src="/resources/images/DPSEClogo.png" alt="" width={25} height={25}/></div>
            <h3 className=" text-sm mb-2 text-gray-600 font-bold">Dirección de Proyección Social y Extensión Cultural</h3>
            <div><Image src="/resources/images/genseg.png" alt="" width={25} height={25} /></div>
          </div>
            <p className="text-sm text-gray-500 p-5 font-medium">
              Genseg es un gestor de proyectos y actividades que maneja la dirección de proyección social y extensión cultural, siendo una entidad de la Universidad Nacional del Altiplano.
            </p>
          </div>

          {/* Enlaces - Acerca de Genseg */}
          <div className="w-auto md:w-[15%] mb-6 md:mb-0">
            <h4 className=" text-lg mb-2 text-gray-800 font-bold">Acerca de genseg</h4>
            <ul className="text-sm text-gray-500 font-medium">
              <li className="mb-1"><a href="#" className="hover:text-blue-500">Nuestra misión y visión</a></li>
              <li className="mb-1"><a href="#" className="hover:text-blue-500">Equipo desarrollador</a></li>
              <li className="mb-1"><a href="#" className="hover:text-blue-500">Política y privacidad</a></li>
              <li><a href="#" className="hover:text-blue-500">Términos y condiciones</a></li>
            </ul>
          </div>

          {/* Mantente Conectado */}
          <div className="w-auto md:w-[15%] mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2 text-gray-800">Mantente conectado</h4>
            <ul className="text-sm text-gray-500 font-medium ">
              <li className="mb-1"><a href="#" className="hover:text-blue-500 flex"><NotepadText />Blogs</a></li>
              <li className="mb-1"><a href="https://www.facebook.com/profile.php?id=100071137256988" className="hover:text-blue-500 flex "> <Facebook /> Facebook</a></li>
              <li><a href="#" className="hover:text-blue-500 flex"> <Twitter />Twitter</a></li>
            </ul>
          </div>

          {/* Servicio al Usuario */}
          <div className="w-auto md:w-[15%] mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2 text-gray-800  py-0 ">Servicio al usuario</h4>
            <ul className="text-sm text-gray-500 font-medium">
              <li className="mb-1"><a href="#" className="hover:text-blue-500">Centro de ayuda</a></li>
              <li className="mb-1"><a href="#" className="hover:text-blue-500">Soporte</a></li>
              <li><a href="#" className="hover:text-blue-500">Comunidad de genseg</a></li>
            </ul>
          </div>

          {/* Métodos de Participación */}
          <div className="w-auto md:w-[15%] py-0">
            <h4 className="font-bold text-lg mb-2 text-gray-800">Métodos de participación</h4>
            <ul className="text-sm text-gray-500 font-medium" >
              <li className="mb-1"><a href="#" className="hover:text-blue-500">Voluntariado</a></li>
              <li className="mb-1"><a href="#" className="hover:text-blue-500">Inscripción en actividades</a></li>
              <li className="mb-1"><a href="#" className="hover:text-blue-500">Certificaciones</a></li>
              <li><a href="#" className="hover:text-blue-500">Consultas y recomendaciones</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
