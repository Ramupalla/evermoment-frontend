'use client';

import { useState } from 'react';


export default function OurWorks() {
  const works = [
    {
      title: "Birthday Memory",
      caption: "A celebration turned into a timeless keepsake",
      category: "Birthday",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Birthday.mp4"
    },
    {
      title: "Anniversary Film",
      caption: "Love stories deserve more, so with just images we crafted this video using AI",
      category: "Anniversary",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Anniversary.mp4"
    },
    {
      title: "Travel Story",
      caption: "Adventures captured, emotions preserved",
      category: "Travel",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Travel.mp4"
    },
    {
      title: "Family Moment",
      caption: "The laughter and warmth of family, forever",
      category: "Family",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Family.mp4"
    },
    {
      title: "Business Story",
      caption: "Your professional moments, elevated",
      category: "Business",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/business.mp4"
    },
    {
      title: "Special Memory",
      caption: "The most special day, beautifully retold",
      category: "Special",
      video: "https://evermoment-media.s3.ap-south-1.amazonaws.com/samples/Special.mp4"
    }
  ];

  // rest of your component stays exactly the same


  const [activeWork, setActiveWork] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal text-center mb-4">
          Our Works
        </h2>
        <p className="text-center text-gray-600 mb-16 text-lg">
          memories we've crafted
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {works.map((work, index) => {
            const isActive = activeWork === index;

            return (
              <div
                key={index}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                  isActive ? 'ring-4 ring-gold' : ''
                }`}
                onClick={() =>
                  setActiveWork(isActive ? null : index)
                }
              >
                {/* Video */}
                <div className="aspect-video relative overflow-hidden">
                  <video
                    src={work.video}
                    autoPlay
                    loop
                    playsInline
                    muted={!isActive}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isActive
                        ? 'opacity-100 scale-105'
                        : 'opacity-60 scale-100'
                    }`}
                  />
                </div>

                {/* TEXT + OVERLAYS (ONLY when NOT active) */}
                {!isActive && (
                  <>
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-6 transition-opacity duration-300">
                      <div className="text-white">
                        <h3 className="font-bold text-lg mb-2">
                          {work.title}
                        </h3>
                        <p className="text-sm text-gray-200">
                          {work.caption}
                        </p>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-charcoal">
                      {work.category}
                    </div>

                    {/* Play icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-xl">▶</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
