"use client";

import { useEffect, useRef, useState } from "react";
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
  const arrangeThumbnails = () => {
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
  };

  const showSlider = (type: 'next' | 'prev') => {
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
  };

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
          {items.map((item) => (
            <div key={item.id} className="item">
              <Image
                src={item.image}
                alt={item.title}
                width={1920}
                height={1080}
                priority={true}
              />
              <div className="content">
                <div className="author">AROUND MANIPAL</div>
                <div className="title">{item.subtitle}</div>
                <div className="topic">{item.title}</div>
                <div className="des">{item.description}</div>
                <div className="buttons">
                  <button>SEE MORE</button>
                  {item.discover ? (
                    <Link href={item.discover} className="discover-link">
                      <button className="discover-button">DISCOVER</button>
                    </Link>
                  ) : (
                    <button>DISCOVER</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="thumbnail" ref={thumbnailRef}>
          {items.map((item) => (
            <div key={item.id} className="item">
              <Image
                src={item.image}
                alt={item.title}
                width={150}
                height={220}
              />
              <div className="content">
                <div className="description">{item.subtitle}</div>
                <div className="title">{item.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="arrows">
          <button id="prev" onClick={() => showSlider('prev')}>&lt;</button>
          <button id="next" onClick={() => showSlider('next')}>&gt;</button>
        </div>

        <div className="time"></div>
      </div>
    </div>
  );
}
