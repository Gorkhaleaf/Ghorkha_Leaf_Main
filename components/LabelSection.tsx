import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

const LabelSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-[269px] rounded-[30px] overflow-hidden">
      <Image
        src="/label-section-background.png"
        alt="Tea background"
        fill
        className="absolute inset-0 object-cover"
      />
      <div className={`relative z-10 flex flex-col justify-center h-full px-4 text-black
        ${isMobile ? 'items-end pr-6 text-right' : 'items-center md:items-end md:pr-16 text-center md:text-right'}`}>
        <div className={`font-gloock mb-2 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
          <div className="block">Good Tea,</div>
          <div className="block">Good Life.</div>
        </div>
        <div className={`font-bold font-fira-sans-condensed mb-4 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          <div className="block">Enjoy 20% offer</div>
          <div className="block">on all herbal blends</div>
        </div>
        <a href="https://www.gorkhaleaf.com/products" target="_blank" rel="noopener noreferrer">
          <Button
            size="lg"
            className={`bg-amber-600 hover:bg-amber-700 ${isMobile ? 'text-sm px-4 py-2' : ''}`}
          >
            Buy Now
            <ArrowRight className={`ml-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </Button>
        </a>
      </div>
    </div>
  );
};

export default LabelSection;
