'use client';

import { useRef, useState } from 'react';
import { useScrollReveal } from "@/lib/useScrollReveal";

type Work = {
  title: string;
  caption: string;
  category: string;
  video: string;
  thumbnail: string;
};

export default function OurWorks() {
  const revealRef = useScrollReveal();

  const works: Work[] = [
    {
      title: "Birthday Memory",
      caption: "A celebration turned into a timeless keepsake",
      category: "Birthday",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Birthday.mp4",
      thumbnail: "https://evermoment-media.s3.ap-south-1.amazonaws.com/thumbnails/birthday.png",
    },
    {
      title: "Anniversary Film",
      caption: "Love stories deserve more, so with just images we crafted this video using AI",
      category: "Anniversary",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Anniversary.mp4",
      thumbnail: "https://evermoment-media.s3.ap-south-1.amazonaws.com/thumbnails/anniversary.png",
    },
    {
      title: "Travel Story",
      caption: "Adventures captured, emotions preserved",
      category: "Travel",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Travel.mp4",
      thumbnail: "https://evermoment-media.s3.ap-south-1.amazonaws.com/thumbnails/travel.png",
    },
    {
      title: "Family Moment",
      caption: "The laughter and warmth of family, forever",
      category: "Family",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Family.mp4",
      thumbnail: "https://evermoment-media.s3.ap-south-1.amazonaws.com/thumbnails/family.png",
    },
    {
      title: "Business Story",
      caption: "Your professional moments, elevated",
      category: "Business",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Business.mp4",
      thumbnail: "https://evermoment-media.s3.ap-south-1.amazonaws.com/thumbnails/business.png",
    },
    {
      title: "Special Memory",
      caption: "The most special day, beautifully retold",
      category: "Special",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Special.mp4",
      thumbnail: "https://evermoment-media.s3.ap-south-1.amazonaws.com/thumbnails/special.png",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handlePlay = (index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
        video.currentTime = 0;
      }
    });

    setActiveIndex(index);

    requestAnimationFrame(() => {
      const video = videoRefs.current[index];
      if (video) video.play().catch(() => {});
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-white">
      <div className="max-w-7xl mx-auto">
        
        <h2 
        ref={revealRef} 
        className="reveal-on-scroll text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal text-center mb-12"
        // style={{ animationDelay: "0.15s" }}
        >
          Our Works
        </h2>
        <p className="font-bold text-charcoal text-center mb-12 text-gray-600 mb-16 text-lg"> memories we've crafted
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {works.map((work, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className={`
                  group relative rounded-2xl overflow-hidden
                  transition-all duration-500 ease-out
                  hover:-translate-y-1 hover:shadow-2xl
                  ${isActive ? 'ring-4 ring-gold' : ''}
                `}
              >
                <div className="aspect-video relative overflow-hidden">
                  {!isActive && (
                    <>
                      {/* Thumbnail */}
                      <img
                        src={work.thumbnail}
                        alt={work.title}
                        className="
                          w-full h-full object-cover
                          transition-transform duration-[1200ms] ease-out
                          group-hover:scale-110
                        "
                      />

                      {/* Play Button */}
                      <button
                        type="button"
                        onClick={() => handlePlay(index)}
                        aria-label={`Play ${work.title}`}
                        className="
                          absolute inset-0 z-20
                          flex items-center justify-center
                          focus:outline-none
                        "
                      >
                        <div
                          className="
                            w-14 h-14 rounded-full
                            bg-black/40 backdrop-blur-sm
                            flex items-center justify-center
                            transition-all duration-300 ease-out
                            scale-95 opacity-80
                            group-hover:scale-110 group-hover:opacity-100
                            shadow-lg
                          "
                        >
                          <span className="text-white text-3xl drop-shadow-lg">
                            ▶
                          </span>
                        </div>
                      </button>

                      {/* Overlay */}
                      <div
                        className="
                          absolute inset-0 z-10
                          bg-gradient-to-t from-black/70 via-black/40 to-transparent
                          transition-opacity duration-500
                          group-hover:from-black/80 group-hover:via-black/60
                          flex items-end p-6
                        "
                      >
                        <div
                          className="
                            text-white
                            transform transition-all duration-500 ease-out
                            translate-y-2 opacity-90
                            group-hover:translate-y-0 group-hover:opacity-100
                          "
                        >
                          <h3 className="font-bold text-lg mb-2">
                            {work.title}
                          </h3>
                          <p className="text-sm text-gray-200">
                            {work.caption}
                          </p>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-charcoal">
                        {work.category}
                      </div>
                    </>
                  )}

                  {isActive && (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el;
                      }}
                      src={work.video}
                      controls
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
