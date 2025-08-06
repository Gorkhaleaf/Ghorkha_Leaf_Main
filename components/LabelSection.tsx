import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const LabelSection = () => {
  return (
    <div className="relative w-full h-[269px] rounded-[30px] overflow-hidden">
      <Image
        src="/label-section-background.png"
        alt="Tea background"
        fill
        className="absolute inset-0 object-cover"
      />
      <div className="relative z-10 flex flex-col items-center md:items-end justify-center h-full px-4 md:pr-16 text-black text-center md:text-right">
        <h2 className="text-4xl font-gloock">Good Tea, Good Life.</h2>
        <p className="text-2xl font-bold font-fira-sans-condensed mb-4">
          Enjoy 20% offer on all herbal blends
        </p>
        <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
          Buy Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default LabelSection;
