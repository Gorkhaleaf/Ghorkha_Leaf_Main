"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const categories = [
  { name: "Black Tea", image: "/categories/black-tea.png" },
  { name: "Green Tea", image: "/categories/green-tea.png" },
  { name: "White Tea", image: "/categories/white-tea.png" },
  { name: "Matcha", image: "/categories/matcha.png" },
  { name: "Herbal Tea", image: "/categories/herbal-tea.png" },
  { name: "Chai", image: "/categories/chai.png" },
  { name: "Oolong", image: "/categories/oolong.png" },
  { name: "Rooibos", image: "/categories/rooibos.png" },
  { name: "Teaware", image: "/categories/teaware.png" },
];

const CategoriesSection = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold mb-4" style={{ color: '#7d806a' }}>Our Collections</h2>
          <p className="text-lg" style={{ color: '#7d806a' }}>
            Discover a world of exquisite teas, each with a unique story and flavor.
          </p>
        </div>
        <div className="overflow-hidden py-8">
          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
        >
          <CarouselContent className="-ml-4">
            {categories.map((category, index) => (
              <CarouselItem
                key={index}
                className={`basis-1/3 md:basis-1/5 pl-4 ${
                  index === current ? "embla__slide--active" : ""
                }`}
              >
                <div
                  className={`p-1 transition-transform duration-300 ease-in-out ${
                    index === current ? "transform scale-125" : ""
                  }`}
                >
                  <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="flex flex-col items-center justify-center p-2">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={150}
                        height={150}
                        className="rounded-full mb-2 object-cover h-[150px] w-[150px] shadow-lg"
                      />
                      <h3
                        className="font-semibold text-base"
                        style={{ color: "#7d806a" }}
                      >
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
