"use client"

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const BrewingInstructions = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      title: "1. 🫖 Boil Water",
      content: "Use fresh, filtered water. Temperature depends on tea type:\n• Green Tea: 75–85°C (not boiling)\n• Black Tea: 90–95°C\n• Herbal Tea: 95–100°C"
    },
    {
      title: "2. 🍃 Add Tea",
      content: "• Loose Leaf: 1 tsp per 200ml cup\n• Tea Bags: 1 bag per cup"
    },
    {
      title: "3. ⏱ Steep Time",
      content: "• Green Tea: 2–3 min\n• Black Tea: 3–4 min\n• Herbal Tea: 5–6 min\n(Don't over-steep to avoid bitterness)"
    },
    {
      title: "4. 🌼 Enjoy",
      content: "Strain the leaves or remove the bag.\nSip slowly and enjoy the aroma, warmth, and wellness.\nOptional: Add honey or lemon."
    }
  ];

  // Liquid motion divider SVG
  const LiquidDivider = () => (
    <svg viewBox="0 0 1200 120" className="w-full" preserveAspectRatio="none">
      <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-green-50" 
            opacity="0.25"></path>
      <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            className="fill-green-50" 
            opacity="0.5"></path>
      <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-green-50"></path>
    </svg>
  );

  return (
    <section className="relative overflow-hidden">
      <LiquidDivider />
      
      <div className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-6 text-green-800 font-serif"
          >
            🌿 Brew the Perfect Cup, Every Time
          </motion.h2>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl font-semibold mb-12 text-center text-green-700 max-w-3xl mx-auto"
          >
            Master the Art of Tea Brewing with Our Step-by-Step Guide
          </motion.h3>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Animated brewing image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl border-4 border-white">
                <img 
                  src="/blog-post-1.png" 
                  alt="Tea brewing guide" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green-900 opacity-70"></div>
              </div>
              
              {/* Floating tea leaves */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-10 -left-6"
              >
                <img 
                  src="/public/about us gifs/leaf.gif" 
                  alt="Floating tea leaf" 
                  className="w-16 h-16 opacity-80"
                />
              </motion.div>
            </motion.div>
            
            {/* Right: Animated instructions */}
            <div ref={ref} className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-100"
                >
                  <h4 className="text-xl font-bold text-green-800 mb-3">{step.title}</h4>
                  <p className="text-gray-700 whitespace-pre-line">{step.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="rotate-180">
        <LiquidDivider />
      </div>
    </section>
  );
};

export default BrewingInstructions;