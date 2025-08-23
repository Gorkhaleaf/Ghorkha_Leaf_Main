'use client';
import Image from 'next/image';

const Gallery = () => {
  const images = [
    {
      src: '/Extra_content/kian-zhang-BFFva-LLZos-unsplash_1.png',
      alt: 'kian-zhang-BFFva-LLZos-unsplash_1',
      colSpan: 'col-span-12',
    },
    {
      src: '/Extra_content/jessica-delp-AMphhfd-Nhk-unsplash_1.png',
      alt: 'jessica-delp-AMphhfd-Nhk-unsplash_1',
      colSpan: 'col-span-6',
    },
    {
      src: '/Extra_content/oriento-dPUWgZLsOk8-unsplash_1.png',
      alt: 'oriento-dPUWgZLsOk8-unsplash_1',
      colSpan: 'col-span-6',
    },
    {
      src: '/Extra_content/alisher-sharip-mumpl9-D7Uc-unsplash_1.png',
      alt: 'alisher-sharip-mumpl9-D7Uc-unsplash_1',
      colSpan: 'col-span-4',
    },
    {
      src: '/Extra_content/ema-grec-QDJQqxvgCXE-unsplash_1.png',
      alt: 'ema-grec-QDJQqxvgCXE-unsplash_1',
      colSpan: 'col-span-4',
    },
    {
      src: '/Extra_content/oriento-z26H7EPwARg-unsplash_1.png',
      alt: 'oriento-z26H7EPwARg-unsplash_1',
      colSpan: 'col-span-4',
    },
    {
      src: '/Extra_content/layout-made-cup-black-tea-leaves-white_1.png',
      alt: 'layout-made-cup-black-tea-leaves-white_1',
      colSpan: 'col-span-3',
    },
    {
      src: '/Extra_content/asian-tea-concept.png',
      alt: 'asian-tea-concept',
      colSpan: 'col-span-3',
    },
    {
      src: '/Extra_content/content-pixie-m-gqDRzbJLQ-unsplash_1.png',
      alt: 'content-pixie-m-gqDRzbJLQ-unsplash_1',
      colSpan: 'col-span-3',
    },
    {
      src: '/Extra_content/tamara-schipchinskaya-jtAvJcJCdgY-unsplash_1.png',
      alt: 'tamara-schipchinskaya-jtAvJcJCdgY-unsplash_1',
      colSpan: 'col-span-3',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p
            className="text-lg sm:text-xl lg:text-2xl font-medium text-green-800 tracking-wide uppercase"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            our gallery
          </p>
          <h2
            className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-green-800 leading-tight"
            style={{ fontFamily: 'Philosopher, sans-serif' }}
          >
            You Too Can Have A Tea Like Mine
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-12 gap-4">
          {images.map((image) => (
            <div key={image.src} className={`${image.colSpan} relative overflow-hidden rounded-lg shadow-lg`}>
              <Image
                src={image.src}
                alt={image.alt}
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            className="px-8 py-3 bg-[#EBA219] text-white text-base sm:text-lg lg:text-xl font-semibold rounded-md shadow-sm hover:bg-[#d4910f] transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EBA219]"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Explore
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
