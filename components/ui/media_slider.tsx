"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import "./NearbyCarousel.css";

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  discover?: string; // Optional link for the discover button
}

export default function NearbyCarousel({ items }: { items: CarouselItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoNextRef = useRef<NodeJS.Timeout | null>(null);

  // Touch event handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const timeRunning = 3000;
  const timeAutoNext = 7000;

  // Function to arrange thumbnails in the correct order
  const arrangeThumbnails = useCallback(() => {
    if (!thumbnailRef.current) return;

    const thumbnailItems = Array.from(thumbnailRef.current.querySelectorAll('.item'));

    // First, mark the active thumbnail
    thumbnailItems.forEach((item, idx) => {
      if (idx === 0) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Create a new array with the thumbnails in the desired order
    const orderedThumbnails: Element[] = [];

    // Start from the next item after active slide
    for (let i = 0; i < thumbnailItems.length; i++) {
      const index = (activeIndex + i + 1) % items.length;
      orderedThumbnails.push(thumbnailItems[index]);
    }

    // Clear the current thumbnails
    while (thumbnailRef.current.firstChild) {
      thumbnailRef.current.removeChild(thumbnailRef.current.firstChild);
    }

    // Append thumbnails in the new order
    orderedThumbnails.forEach(item => {
      thumbnailRef.current?.appendChild(item);
    });
  }, [activeIndex, items.length]);

  const showSlider = useCallback((type: 'next' | 'prev') => {
    if (!carouselRef.current || !sliderRef.current || !thumbnailRef.current) return;

    const sliderItems = sliderRef.current.querySelectorAll('.item');

    if (type === 'next') {
      sliderRef.current.appendChild(sliderItems[0]);
      carouselRef.current.classList.add('next');
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else {
      sliderRef.current.prepend(sliderItems[sliderItems.length - 1]);
      carouselRef.current.classList.add('prev');
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }

    // First clear existing timeouts to prevent conflicts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (autoNextRef.current) clearTimeout(autoNextRef.current);

    // Rearrange thumbnails after changing the active slide
    timeoutRef.current = setTimeout(() => {
      carouselRef.current?.classList.remove('next');
      carouselRef.current?.classList.remove('prev');
      arrangeThumbnails();
    }, timeRunning);

    // Set up the next automatic slide change
    autoNextRef.current = setTimeout(() => {
      showSlider('next');
    }, timeAutoNext);
  }, [arrangeThumbnails, items.length, timeRunning, timeAutoNext]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const touchDiff = touchStartX.current - touchEndX.current;

    // Minimum swipe distance to trigger slide change
    const minSwipeDistance = 50;

    if (touchDiff > minSwipeDistance) {
      // Swiped left, go to next slide
      showSlider('next');
    } else if (touchDiff < -minSwipeDistance) {
      // Swiped right, go to previous slide
      showSlider('prev');
    }

    // Reset touch coordinates
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    // Initial arrangement of thumbnails
    arrangeThumbnails();

    // Start auto-rotation
    autoNextRef.current = setTimeout(() => {
      showSlider('next');
    }, timeAutoNext);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (autoNextRef.current) clearTimeout(autoNextRef.current);
    };
  }, [arrangeThumbnails, showSlider]);

  return (
    <div className="container">
      <div
        className="carousel"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="list" ref={sliderRef}>
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="item relative w-full h-full"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={1920}
                height={1080}
                priority={idx === 0}
                loading={idx === 0 ? undefined : 'lazy'}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="content absolute top-1/4 w-full max-w-[90vw] left-1/2 -translate-x-1/2 pr-0 box-border text-white drop-shadow-lg text-shadow-lg">
                <div className="author font-bold tracking-widest text-xs md:text-base">AROUND MANIPAL</div>
                <div className="title text-2xl md:text-4xl font-bold leading-tight">{item.subtitle}</div>
                <div className="topic text-2xl md:text-4xl font-bold leading-tight text-pink-500">{item.title}</div>
                <div className="des mt-2">{item.description}</div>
                <div className="buttons grid grid-cols-2 gap-2 mt-4">
                  <button className="rounded-lg bg-neutral-700 font-medium tracking-wider font-sans">SEE MORE</button>
                  {item.discover ? (
                    <Link href={item.discover} className="discover-link">
                      <button className="rounded-lg bg-transparent border border-white text-neutral-100 font-medium tracking-wider font-sans">DISCOVER</button>
                    </Link>
                  ) : (
                    <button className="rounded-lg bg-transparent border border-white text-neutral-100 font-medium tracking-wider font-sans">DISCOVER</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="thumbnail absolute bottom-12 left-1/2 z-10 flex gap-4" style={{transform: 'translateX(-50%)'}} ref={thumbnailRef}>
          {items.map((item, idx) => (
            <div key={item.id} className="item w-24 h-36 flex-shrink-0 relative">
              <Image
                src={item.image}
                alt={item.title}
                width={150}
                height={220}
                priority={idx === 0}
                loading={idx === 0 ? undefined : 'lazy'}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="content text-white absolute bottom-2 left-2 right-2">
                <div className="description font-light">{item.subtitle}</div>
                <div className="title font-medium">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="arrows absolute top-[80%] right-1/2 z-10 flex gap-2 items-center w-72 max-w-[30%]" style={{transform: 'translateX(50%)'}}>
          <button className="w-10 h-10 rounded-full bg-white/25 border-none text-white font-mono font-bold transition duration-500 hover:bg-white hover:text-black" id="prev" onClick={() => showSlider('prev')}>&lt;</button>
          <button className="w-10 h-10 rounded-full bg-white/25 border-none text-white font-mono font-bold transition duration-500 hover:bg-white hover:text-black" id="next" onClick={() => showSlider('next')}>&gt;</button>
        </div>
        <div className="time"></div>
      </div>
    </div>
  );
}
