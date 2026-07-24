'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-lavender-50 shadow-soft">
        <Image
          src={images[active]}
          alt={`${name} — image ${active + 1} of ${images.length}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div role="tablist" aria-label={`${name} images`} className="mt-4 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition ${
                i === active ? 'border-blush-500' : 'border-transparent hover:border-lavender-300'
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
