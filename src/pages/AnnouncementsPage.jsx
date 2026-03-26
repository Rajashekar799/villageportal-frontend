import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { fallbackAnnouncements } from '../data/fallbackData';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getAnnouncements()
      .then(setAnnouncements)
      .catch(() => {
        setAnnouncements(fallbackAnnouncements);
        setError('Showing sample announcements. Backend unavailable.');
      });
  }, []);

  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="section-title">Announcements</h1>
        {error && <p className="mt-2 text-xs text-amber-700">{error}</p>}
      </section>

      {announcements.map((item) => (
        <article key={item.id} className="card">
          <h2 className="text-lg font-bold text-soil">{item.title}</h2>
          <p className="mt-2 text-sm">{item.details}</p>
          <p className="mt-2 text-xs text-slate-500">Date: {item.dateLabel || item.postedDate}</p>
        </article>
      ))}
    </div>
  );
}
