import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css/bundle';

export default function SampleTokensGallery() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreviewTokens();
  }, []);

  function loadPreviewTokens() {
    // Create preview tokens using static images
    const previewTokens = [];

    // Use all available images
    for (let i = 1; i <= 6; i++) {
      const paddedNum = i.toString().padStart(2, '0');
      previewTokens.push({
        id: i,
        image: `/samples/${paddedNum}.png`,
      });
    }

    setTokens(previewTokens);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No preview tokens available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="max-w-sm mx-auto md:px-4 sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          spaceBetween={20}
          centeredSlides={true}
          loop={true}
          autoplay={{
            disableOnInteraction: false,
          }}
          // navigation={true}
          effect="coverflow"
          coverflowEffect={{
            rotate: 10,
            stretch: 0,
            depth: 80,
            modifier: 1.5,
            // slideShadows: false,
          }}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 1.3,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 1.5,
              spaceBetween: 50,
            },
          }}
        >
          {tokens.map((token) => (
            <SwiperSlide key={token.id}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-purple-300 transition-all duration-300">
                <div className="aspect-square overflow-hidden relative group">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
