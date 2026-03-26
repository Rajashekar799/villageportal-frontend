import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { fallbackShops } from '../data/fallbackData';

export default function ShopsPage() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    api.getShops().then(setShops).catch(() => setShops(fallbackShops));
  }, []);

  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="section-title">Shops and Services</h1>
      </section>

      <div className="space-y-3">
        {shops.map((shop) => (
          <article key={shop.id} className="card">
            <h2 className="text-lg font-bold text-soil">{shop.shopName}</h2>
            <p className="text-sm"><strong>Owner:</strong> {shop.ownerName}</p>
            <p className="text-sm"><strong>Phone:</strong> {shop.phone}</p>
            <p className="text-sm"><strong>Category:</strong> {shop.category}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
