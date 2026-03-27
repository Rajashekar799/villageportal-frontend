import { useEffect, useState } from 'react';
import { api, resolveAssetUrl } from '../api/client';
import { fallbackGallery } from '../data/fallbackData';

export default function GalleryPage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    api.getGalleryImages().then(setImages).catch(() => setImages(fallbackGallery));
  }, []);

  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="section-title">Village Gallery</h1>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image) => (
          <article key={image.id} className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-card">
            <img
              src={resolveAssetUrl(image.thumbnailUrl || image.imageUrl)}
              alt={image.title}
              className="h-28 w-full object-cover sm:h-36"
              loading="lazy"
            />
            <div className="p-2">
              <h2 className="text-sm font-semibold text-soil">{image.title}</h2>
              <p className="text-xs text-slate-600">{image.category}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
