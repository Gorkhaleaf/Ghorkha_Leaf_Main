import Image from 'next/image';
import { Button } from './ui/button';

const AboutUsSection = () => {
  return (
<section className="relative py-20">
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center lg:-m-16">
          <div className="flex items-center justify-center lg:justify-start">
            <Image
              src="/image_about.png"
              alt="About Us"
              width={500}
              height={500}
              className="w-full h-auto max-w-sm md:max-w-md lg:max-w-lg"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase text-brand-green tracking-widest mb-2">advantages</h3>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-green mb-6">The Hidden Health Benefits of Tea</h2>
            <p className="text-brand-green mb-8">
              Discover the wellness in every cup. Our teas are rich in antioxidants and natural compounds that can help improve your health, boost your immune system, and provide a sense of calm and well-being.
            </p>
            <Button size="lg" className="bg-brand-green hover:bg-brand-green/90">
              Explore
            </Button>
          </div>
        </div>
        <div className="text-center mt-20">
          <h3 className="text-lg font-bold uppercase text-brand-green tracking-widest mb-2">Since 2022</h3>
          <h2 className="text-5xl font-bold text-brand-green mb-6">Why Choose Us</h2>
          <p className="text-brand-green max-w-3xl mx-auto mb-12">
            We are committed to providing the highest quality teas, sourced ethically and sustainably. Our passion for tea and dedication to our customers sets us apart.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <Image
                src="/organic-products.png"
                alt="Organic Products"
                width={112}
                height={113}
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-brand-green">Organic Products</h3>
            </div>
            <div className="text-center">
              <Image
                src="/customer-service.png"
                alt="Great customer service"
                width={114}
                height={113}
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-brand-green">Great Customer Service</h3>
            </div>
            <div className="text-center">
              <Image
                src="/natural-ingredients.png"
                alt="Natural Ingredients"
                width={112}
                height={113}
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-brand-green">Natural Ingredients</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
