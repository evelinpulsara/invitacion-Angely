'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, MessageCircle, Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX, Gift, Crown, Flower2 } from 'lucide-react';

export default function XVInvitation() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const [processedSapo, setProcessedSapo] = useState<string | null>(null);
  const [processedTiana, setProcessedTiana] = useState<string | null>(null);

  // Countdown Timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2025-11-15T19:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Si la fecha ya pasó, establece todo en 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.log("Autoplay bloqueado por el navegador. El usuario debe interactuar primero.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleWhatsapp = () => {
    const phone = '+573113024672';
    const message = 'Hola, confirmo mi asistencia a la fiesta de XV años de Angely 🎉😸';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleMaps = () => {
    window.open(
      'https://www.google.com/maps/search/Hacienda+Cuatro+Santos,+Pasto,+Nariño,+Colombia',
      '_blank'
    );
  };

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl px-6 py-4 shadow-lg border-2 border-green-300 hover:scale-105 transition-transform duration-300">
        <span className="text-4xl font-bold text-green-800 font-serif">{String(value).padStart(2, '0')}</span>
      </div>
      <p className="text-green-700 text-xs font-bold mt-3 uppercase tracking-widest">{label}</p>
    </div>
  );

  // FUNCIÓN MOVIDA AQUÍ (antes del return)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Convierte los píxeles casi blancos a transparentes usando canvas
  const processImageToCutout = async (src: string, tolerance = 200) => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('No canvas context'));
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // si el pixel es suficientemente claro (casi blanco) lo hacemos transparente
            if (r >= tolerance && g >= tolerance && b >= tolerance) {
              data[i + 3] = 0; // alpha
            }
          }
          ctx.putImageData(imgData, 0, 0);
          const out = canvas.toDataURL('image/png');
          resolve(out);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  };

  useEffect(() => {
    // procesa las imágenes al montar el componente; tolerancia ajustada para eliminar más el fondo
    (async () => {
      try {
        const sapoData = await processImageToCutout('/imagenes/sapo.png', 200);
        setProcessedSapo(sapoData);
      } catch (e) {
        // si falla, no bloqueamos la app
        console.warn('Procesamiento sapo falló', e);
      }
      try {
        const tianaData = await processImageToCutout('/imagenes/tiana.png', 200);
        setProcessedTiana(tianaData);
      } catch (e) {
        console.warn('Procesamiento tiana falló', e);
      }
    })();
  }, []);

  // Función para abrir el modal con la imagen seleccionada
  const openModal = (src: string) => {
    setModalImageSrc(src);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Evita scroll en el fondo
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restaura el scroll
  };

  // Cerrar modal al presionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Cerrar modal al hacer clic fuera de la imagen
  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      closeModal();
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/imagenes/Fondo.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Contenedor interno con gradiente y padding */}
      <div className="min-h-screen bg-gradient-to-b from-white/70 via-white/60 to-white/70">

        <div className="fixed top-10 left-10 opacity-20 hidden sm:block">
          <Flower2 size={48} className="text-green-400" />
        </div>
        <div className="fixed bottom-20 right-10 opacity-20 hidden sm:block" style={{ animationDelay: '1s' }}>
          <Flower2 size={48} className="text-emerald-300" />
        </div>

        {/* Header Hero Section */}
        <div className="relative pt-12 pb-16 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100 to-lime-100 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-6 flex justify-center gap-4">
              <img src="/imagenes/tiara.png" alt="Tiara" className="w-40 md:w-48 lg:w-56 object-contain drop-shadow-lg" />
            </div>

            {/* Texto "MIS XV AÑOS" en plateado oscuro metálico */}
            <p className="text-2xl md:text-3xl tracking-widest font-semibold mb-2" 
               style={{ 
                 fontFamily: 'Georgia, serif', 
                 color: '#8a8a8a',
                 textShadow: '0 3px 10px rgba(0,0,0,0.08), 0 0 18px rgba(0,0,0,0.06)',
                 background: 'linear-gradient(135deg, #8a8a8a 0%, #a0a0a0 50%, #c8c8c8 100%)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 backgroundClip: 'text'
               }}>
              MIS
            </p>
            <h1 className="text-7xl font-bold mb-3" 
                style={{ 
                  fontFamily: 'serif', 
                  color: '#9a9a9a',
                  textShadow: '0 5px 14px rgba(0,0,0,0.09), 0 0 28px rgba(0,0,0,0.06)',
                  background: 'linear-gradient(135deg, #808080 0%, #9a9a9a 30%, #cfcfcf 70%, #9b9b9b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              XV AÑOS
            </h1>
            
            {/* Nombre "Angely Tatiana" en plateado oscuro metálico */}
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-silver-200 to-silver-300 rounded-full blur-xl opacity-30"></div>
              <h2 className="relative text-6xl italic font-light px-8 py-4" 
                  style={{ 
                    fontFamily: 'Georgia, serif', 
                    color: '#9a9a9a',
                    textShadow: '0 3px 10px rgba(0,0,0,0.08), 0 0 18px rgba(0,0,0,0.06)',
                    background: 'linear-gradient(135deg, #8f8f8f 0%, #b0b0b0 40%, #d0d0d0 60%, #9f9f9f 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                ANGELY TATIANA
              </h2>
            </div>

            <div className="flex justify-center gap-6 mt-6 items-center">
              <img src={processedSapo || '/imagenes/sapo.png'} alt="Sapo" className="cutout-img animate-bounce" style={{ animationDelay: '0s', width: '52px', height: '52px' }} />
              <Crown size={44} className="animate-bounce" style={{ animationDelay: '0.2s', color: '#7BBD89' }} />
              <img src={processedTiana || '/imagenes/sapo2.png'} alt="Sapo2" className="cutout-img animate-bounce" style={{ animationDelay: '0.4s', width: '52px', height: '52px' }} />
            </div>
          </div>
        </div>

        {/* Reproductor de música */}
        <div className="max-w-md mx-auto px-4 py-8 mb-6">
          <div className="bg-transparent rounded-3xl shadow-2xl p-6 backdrop-blur-sm border border-green-200/50">
            <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden mt-1">
              <img
                src="/imagenes/Reproductor.jpg"
                alt="Portada de la canción"
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: 'center 60%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-green-900">Ma Belle Evangeline</h3>
              <p className="text-green-700 text-sm">La princesa y el sapo</p>
            </div>

            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-green-200 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${(currentTime / (duration || 1)) * 100}%, #e2e8f0 ${(currentTime / (duration || 1)) * 100}%, #e2e8f0 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-green-700 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={togglePlay}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg"
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <VolumeX size={20} className="text-emerald-600" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-green-200 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`,
                }}
              />
              <Volume2 size={20} className="text-emerald-600" />
            </div>
          </div>

          <audio
            ref={audioRef}
            id="background-music"
            src="/musica/Princesa.mp3"
            preload="auto"
            loop
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
          />
        </div>

        {/* Countdown o mensaje de finalización */}
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
            <div className="mb-6">
              <p className="text-xl md:text-2xl font-serif text-green-800 font-medium">
                ¡El evento ya finalizó!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-center gap-2 items-center">
                <Heart size={28} className="text-green-500" />
                <h3 className="text-3xl text-green-900 font-serif">Faltan</h3>
                <Heart size={28} className="text-green-500" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                <TimeBox value={timeLeft.days} label="Días" />
                <TimeBox value={timeLeft.hours} label="Horas" />
                <TimeBox value={timeLeft.minutes} label="Minutos" />
                <TimeBox value={timeLeft.seconds} label="Segundos" />
              </div>
            </>
          )}
        </div>

        {/* Foto Principal - MUY LARGA Y SIN RECORTES */}
        <div className="px-4 max-w-4xl mx-auto mb-8 mt-12">
          <div className="flex flex-col items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-emerald-300 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative main-photo-container w-80 h-[40rem] md:w-96 md:h-[50rem] bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl shadow-2xl overflow-hidden border-4 border-white hover:border-green-300 transition-all transform hover:scale-105">
                <img src="/imagenes/Foto0.jpg" alt="Foto Principal" className="w-full h-full object-cover" />
                <div className="absolute inset-0 main-photo-glow pointer-events-none"></div>
                <div className="absolute top-4 right-4">
                  <Crown size={28} className="text-amber-500 drop-shadow-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NUEVA SECCIÓN: RECUERDOS DE MI INFANCIA */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-serif font-bold text-green-800 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              Recuerdos de mi infancia
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Imagen 1: Bebé con gafas */}
            <div 
              className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => openModal('/imagenes/foto2.jpg')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              <img 
                src="/imagenes/foto2.jpg" 
                alt="Recuerdo de infancia 1" 
                className="w-full h-64 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                  <Play size={24} className="text-green-700" />
                </div>
              </div>
            </div>

            {/* Imagen 2: Bebé con vestido verde */}
            <div 
              className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => openModal('/imagenes/Foto1.jpg')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              <img 
                src="/imagenes/Foto1.jpg" 
                alt="Recuerdo de infancia 2" 
                className="w-full h-64 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                  <Play size={24} className="text-green-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de invitación */}
        <div className="max-w-3xl mx-auto px-4 py-10 mb-8 text-center">
          <p className="text-green-800 text-xl italic font-light mb-8 leading-relaxed px-6" style={{ fontFamily: 'Georgia, serif' }}>
            Los momentos más felices de la vida se vuelven <br/>
            mágicos cuando los compartimos con nuestra<br/>
            familia y amigos más queridos.<br/>
             <br/>
             Tú eres parte de esa magia, por eso quiero<br/>
             que me acompañes a celebrar mis 15 años y<br/>
             hacer de este dia un recuerdo inolvidable.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-2 mt-10">
            <div className="relative animate-float">
              <img
                src="/imagenes/tiara.png"
                alt="Tiara decorativa"
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
                <h3 className="text-5xl md:text-6xl font-normal leading-tight" 
                    style={{ 
                      fontFamily: 'cursive',
                      color: '#38761D',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}>
                    Bienvenidos a mis
                </h3>
                <h3 className="text-7xl md:text-8xl font-normal leading-tight -mt-4" 
                    style={{ 
                      fontFamily: 'cursive', 
                      color: '#38761D', 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}>
                    Quince
                </h3>
            </div>
            <p className="text-xl font-light mb-4" 
               style={{ 
                 fontFamily: 'Georgia, serif',
                 color: '#016630'
               }}>
              Con la bendición de Dios y mis padres
            </p>
            <p className="text-3xl font-normal" 
               style={{ 
                 fontFamily: 'cursive', 
                 color: '#38761D', 
                 textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
               }}>
              Adriana y Gustavo
            </p>
          </div>
        </div>

        {/* Fecha y hora - SECCIÓN MEJORADA CON GIF */}
        <div className="text-center py-12 w-full max-w-4xl mx-auto relative">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
            <img 
              src="/imagenes/luces.gif" 
              alt="Brillitos"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain opacity-80"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                console.log('No se pudo cargar el GIF de luces');
              }}
            />
          </div>
          
          <div className="absolute text-2xl text-green-400 opacity-30 animate-pulse" style={{top: '10%', left: '15%'}}>🌿</div>
          <div className="absolute text-xl text-green-400 opacity-30 animate-pulse" style={{top: '20%', right: '20%', animationDelay: '1s'}}>✨</div>
          <div className="absolute text-2xl text-green-400 opacity-30 animate-pulse" style={{bottom: '15%', left: '10%', animationDelay: '2s'}}>🍃</div>
          
          <div className="max-w-2xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-medium bg-gradient-to-r from-green-800 via-green-600 to-green-800 bg-clip-text text-transparent uppercase tracking-[0.3em] mb-4">
                Noviembre
              </h2>
              <div className="relative h-6">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-green-400">❋</div>
              </div>
            </div>

            {/* Contenedor principal de fecha */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 my-12 relative">
              {/* SÁBADO */}
              <div className="flex flex-col items-center min-w-[80px] sm:min-w-[120px] relative py-3">
                <div className="absolute top-0 left-1/2 w-12 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent transform -translate-x-1/2"></div>
                <p className="font-serif text-base sm:text-xl font-medium tracking-[0.2em] text-green-800 uppercase">
                  Sábado
                </p>
                <div className="absolute bottom-0 left-1/2 w-12 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent transform -translate-x-1/2"></div>
              </div>

              {/* DÍA 15 - Elemento central */}
              <div className="text-center relative">
                <div className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[14rem] leading-none font-serif font-light bg-gradient-to-b from-green-800 to-green-600 bg-clip-text text-transparent relative z-10"
                     style={{filter: 'drop-shadow(0 4px 8px rgba(45, 80, 22, 0.15))'}}>
                  15
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 border border-green-200 rounded-full opacity-30"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-radial from-green-100 to-transparent rounded-full opacity-20"></div>
                </div>
              </div>

              {/* 3:00 PM */}
              <div className="flex flex-col items-center min-w-[80px] sm:min-w-[120px] relative py-3">
                <div className="absolute top-0 left-1/2 w-12 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent transform -translate-x-1/2"></div>
                <p className="font-serif text-base sm:text-xl font-medium tracking-[0.2em] text-green-800 uppercase">
                  3:00 PM
                </p>
                <div className="absolute bottom-0 left-1/2 w-12 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent transform -translate-x-1/2"></div>
              </div>
            </div>
            
            {/* 2025 */}
            <div className="mt-12">
              <div className="relative h-6 mb-4">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-green-400">❋</div>
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif font-medium bg-gradient-to-r from-green-800 via-green-600 to-green-800 bg-clip-text text-transparent uppercase tracking-[0.3em]">
                2025
              </h3>
            </div>

            {/* Línea decorativa final */}
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-green-300"></div>
                <span className="text-green-400 text-lg">❋</span>
                <div className="w-24 h-px bg-green-300"></div>
                <span className="text-green-400 text-xl">✦</span>
                <div className="w-24 h-px bg-green-300"></div>
                <span className="text-green-400 text-lg">❋</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-green-300"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-12 mt-4">
            <img
                src="/imagenes/sapos.png"
                alt="Imagen central de la invitación"
                className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
              />
        </div>

        {/* Timeline - Versión móvil (como en la foto) */}
        <div className="max-w-6xl mx-auto px-4 py-6 mb-12">
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/30">
            <h4 className="text-center text-lg font-semibold text-green-900 mb-6">Programa (resumen)</h4>

            {/* Versión móvil (visible en todos los dispositivos) */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-green-50/70 p-3 rounded-xl">
                <div className="bg-green-50 p-2 rounded-full shadow-md">
                  <MapPin size={20} className="text-green-900" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-green-900">Llegada</p>
                  <p className="text-xs text-gray-600">3:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-green-50/70 p-3 rounded-xl">
                <div className="bg-green-50 p-2 rounded-full shadow-md">
                  <Crown size={20} className="text-green-900" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-green-900">Eucaristia</p>
                  <p className="text-xs text-gray-600">4:00 PM</p>
                </div>
              </div>

              {/* CORRECCIÓN: Cambiado de emoji a ícono Gift */}
              <div className="flex items-center gap-4 bg-green-50/70 p-3 rounded-xl">
                <div className="bg-green-50 p-2 rounded-full shadow-md">
                  <Gift size={20} className="text-green-900" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-green-900">Brindis y cena</p>
                  <p className="text-xs text-gray-600">7:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-green-50/70 p-3 rounded-xl">
                <div className="bg-green-50 p-2 rounded-full shadow-md">
                  <Heart size={20} className="text-green-900" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-green-900">Rumba</p>
                  <p className="text-xs text-gray-600">9:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-green-50/70 p-3 rounded-xl">
                <div className="bg-green-50 p-2 rounded-full shadow-md">
                  <Flower2 size={20} className="text-green-900" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-green-900">Dulces sueños</p>
                  <p className="text-xs text-gray-600">4:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="max-w-2xl mx-auto px-4 py-12 text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <div className="relative">
              <MapPin size={36} className="text-emerald-500 drop-shadow-lg" />
              <div className="absolute inset-0 animate-ping">
                <MapPin size={36} className="text-emerald-300 opacity-40" />
              </div>
            </div>
          </div>
          <h3 className="text-3xl text-green-900 font-serif mb-6" style={{ fontFamily: 'Georgia, serif' }}>Lugar</h3>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 to-green-100/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 transform -rotate-1"></div>
            <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <p className="text-green-800 text-xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Hacienda Cuatro Santos</p>
              <p className="text-green-700 text-lg" style={{ fontFamily: 'Georgia, serif' }}>Pasto, Nariño - Colombia</p>
            </div>
          </div>
          
          <button
            onClick={handleMaps}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full shadow-xl transform hover:scale-110 transition-all duration-300"
          >
            <MapPin size={22} /> Cómo llegar
          </button>
        </div>

        {/* Lluvia de sobres */}
        <div className="max-w-2xl mx-auto px-4 py-12 text-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 to-emerald-200/40 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl"></div>
            <div className="relative animate-float">
              <Gift size={48} className="text-green-600 mx-auto mb-6 drop-shadow-lg" />
            </div>
            <div className="relative p-8">
              <p className="text-green-800 text-xl font-bold mb-3" 
                 style={{ 
                   fontFamily: 'Georgia, serif',
                   textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                 }}>
                Lluvia de Sobres
              </p>
              <p className="text-green-700 text-lg italic"
                 style={{ 
                   fontFamily: 'Georgia, cursive',
                   color: '#c0c0c0',
                   textShadow: '0 2px 8px rgba(192,192,192,0.3)',
                   background: 'linear-gradient(135deg, #a8a8a8 0%, #c0c0c0 50%, #e8e8e8 100%)',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text'
                 }}>
                Tu presencia es el mejor regalo
              </p>
            </div>
          </div>
        </div>

        {/* RSVP */}
        <div className="max-w-2xl mx-auto px-4 py-12 text-center mb-12">
          <p className="text-green-800 text-lg mb-8 font-light">
            Queremos preparar todos los detalles, déjanos saber si contaremos con tu asistencia.
          </p>
          <button
            onClick={handleWhatsapp}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 text-lg"
          >
            <MessageCircle size={26} /> Confirmar asistencia
          </button>
        </div>

        {/* Footer Texto Fijo */}
        <div className="text-center py-6">
          <div className="flex justify-center gap-6 mb-4">
            <Flower2 size={36} className="text-green-500" />
            <Crown size={36} className="text-amber-500" />
            <Flower2 size={36} className="text-green-500" />
          </div>
          <p className="text-green-600/60 text-sm font-light">Una celebración mágica, como en los cuentos</p>
          <p className="text-xs text-green-600 font-medium mt-2">Diseñado por: Evelin Pulsara</p>
        </div>

        {/* Modal de Imagen */}
        {isModalOpen && (
          <div 
            className="modal-overlay fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={handleModalClick}
          >
            <div className="modal-content relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex justify-center items-center">
                <img 
                  src={modalImageSrc} 
                  alt="Recuerdo de infancia" 
                  className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes glowPulse {
            0% { box-shadow: 0 0 6px rgba(123,189,137,0.12), inset 0 0 12px rgba(255,210,120,0.02); }
            50% { box-shadow: 0 0 28px rgba(123,189,137,0.28), inset 0 0 24px rgba(255,210,120,0.04); }
            100% { box-shadow: 0 0 6px rgba(123,189,137,0.12), inset 0 0 12px rgba(255,210,120,0.02); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .main-photo-container {
            border-radius: 1rem;
            overflow: hidden;
          }

          .main-photo-glow {
            animation: glowPulse 4s infinite ease-in-out;
          }

          /* Estilos para el modal */
          .modal-overlay {
            background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%);
          }

          .modal-content {
            animation: slideIn 0.3s ease-out;
          }

          @keyframes slideIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          /* Para pantallas pequeñas, el modal ocupa casi toda la pantalla */
          @media (max-width: 640px) {
            .modal-content {
              max-w: 95vw;
              max-h: 90vh;
              margin: auto;
            }
          }
        `}</style>
      </div>
    </div>
  );
}