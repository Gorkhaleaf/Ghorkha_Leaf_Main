'use client'
import Image from 'next/image'

const PerfectionSection = () => {
  const features = [
    {
      icon: '/perfection_section_v2/star.svg',
      text: 'Great quality',
      align: 'left',
    },
    {
      icon: '/perfection_section_v2/worldwide_shipping.svg',
      text: 'Worldwide shipping',
      align: 'left',
    },
    {
      icon: '/perfection_section_v2/best_seller.svg',
      text: 'Best seller',
      align: 'left',
    },
    {
      icon: '/perfection_section_v2/organic_product.svg',
      text: 'Organic Product',
      align: 'right',
    },
    {
      icon: '/perfection_section_v2/loyal_tea_rewards.svg',
      text: 'Loyal-tea rewards',
      align: 'right',
    },
    {
      icon: '/perfection_section_v2/eco_package.svg',
      text: 'Eco package',
      align: 'right',
    },
  ]

  return (
    <section className="relative py-12 md:py-20 bg-[#F9F9F9] overflow-visible">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <p
            className="text-lg md:text-xl text-brand-green tracking-widest uppercase"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Best seller
          </p>
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-green mt-2 md:mt-4"
            style={{ fontFamily: 'Philosopher, sans-serif' }}
          >
            We Believe in Perfection in the art of Tea.
          </h2>
        </div>

        {/* Mobile Layout - Stack vertically */}
        <div className="block md:hidden">
          {/* Product Image - Top on mobile */}
          <div className="flex justify-center items-center relative mb-8">
            <div className="relative">
              <Image
                src="/Products/08 Dawn of The Hills.png"
                alt="Gorkha Leaf Product"
                width={300}
                height={270}
                className="relative z-10"
                style={{ maxWidth: 'none', maxHeight: 'none' }}
              />
              {/* Leaf background overlay for mobile */}
              <div className="absolute bottom-0 left-1/2 transform translate-x-4 opacity-100 z-20">
                <div className="relative" style={{ width: '200px', height: '100px' }}>
                  <Image
                    src="/perfection_section_v2/leaves_background.png"
                    alt="leaves background overlay"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg scale-x-[-1]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features in a grid layout for mobile */}
          <div className="bg-[#EEF0DC] rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  <Image
                    src={feature.icon}
                    alt={feature.text}
                    width={32}
                    height={32}
                    className="filter flex-shrink-0"
                    style={{ filter: 'invert(0.2) sepia(1) saturate(2) hue-rotate(80deg) brightness(0.4)' }}
                  />
                  <p
                    className="text-xl md:text-2xl font-medium text-[#166434]"
                    style={{ fontFamily: 'Philosopher, sans-serif' }}
                  >
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Three column */}
        <div className="hidden md:flex justify-center items-center relative">
          {/* Continuous green background box matching text dimensions */}
          <div className="absolute inset-0 z-0 flex items-center">
            <div className="w-full bg-[#EEF0DC] rounded-lg mx-4 flex items-center min-h-[492px]">
              <div className="w-1/3 pr-6 p-8">
                <div className="space-y-12 opacity-0">
                  {features
                    .filter((feature) => feature.align === 'left')
                    .map((feature) => (
                      <div key={feature.text} className="flex items-center gap-3">
                        <div className="w-10 h-10"></div>
                        <p className="text-3xl font-medium">
                          {feature.text}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="w-1/3"></div>

              <div className="w-1/3 pl-6 p-8">
                <div className="space-y-12 opacity-0">
                  {features
                    .filter((feature) => feature.align === 'right')
                    .map((feature) => (
                      <div key={feature.text} className="flex items-center justify-end gap-3">
                        <p className="text-3xl font-medium">
                          {feature.text}
                        </p>
                        <div className="w-10 h-10"></div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actual content with higher z-index */}
          <div className="w-1/3 space-y-12 relative z-10 flex flex-col items-start justify-center ml-[10%]">
            {features
              .filter((feature) => feature.align === 'left')
              .map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  <Image
                    src={feature.icon}
                    alt={feature.text}
                    width={40}
                    height={40}
                    className="filter"
                    style={{ filter: 'invert(0.2) sepia(1) saturate(2) hue-rotate(80deg) brightness(0.4)' }}
                  />
                  <p
                    className="text-3xl font-medium text-[#166434]"
                    style={{ fontFamily: 'Philosopher, sans-serif' }}
                  >
                    {feature.text}
                  </p>
                </div>
              ))}
          </div>

          {/* Central product image - primary focal point on top of green background */}
          <div className="w-1/3 flex justify-center items-center relative z-20 h-[492px] overflow-visible">
            <div className="relative -mt-12 overflow-visible">
              <Image
                src="/Products/08 Dawn of The Hills.png"
                alt="Gorkha Leaf Product"
                width={497}
                height={447}
                className="relative z-30"
                style={{ maxWidth: 'none', maxHeight: 'none' }}
              />
              {/* Leaf background overlay towards product image footer */}
              <div className="absolute bottom-1 left-1/2 transform  translate-x-[40px] opacity-100 z-40">
                <div className="relative" style={{ width: '276px', height: '138px' }}>
                  <Image
                    src="/perfection_section_v2/leaves_background.png"
                    alt="leaves background overlay"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg scale-x-[-1]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3 space-y-12 relative z-10 flex flex-col items-end justify-center mr-[10%]">
            {features
              .filter((feature) => feature.align === 'right')
              .map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-3"
                >
                  <p
                    className="text-3xl font-medium text-[#166434]"
                    style={{ fontFamily: 'Philosopher, sans-serif' }}
                  >
                    {feature.text}
                  </p>
                  <Image
                    src={feature.icon}
                    alt={feature.text}
                    width={40}
                    height={40}
                    className="filter"
                    style={{ filter: 'invert(0.2) sepia(1) saturate(2) hue-rotate(80deg) brightness(0.4)' }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

    </section>
  )
}

export default PerfectionSection

