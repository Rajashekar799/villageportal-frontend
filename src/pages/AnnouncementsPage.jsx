import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { fallbackAnnouncements } from '../data/fallbackData';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAnnouncements()
      .then(setAnnouncements)
      .catch(() => {
        setAnnouncements(fallbackAnnouncements);
        setError('Showing sample announcements. Backend unavailable.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="section-title">Announcements</h1>
        {error && <p className="mt-2 text-xs text-amber-700">{error}</p>}
      </section>

      {loading && (
        <>
          {[1, 2, 3].map((item) => (
            <article key={item} className="card animate-pulse">
              <div className="h-6 w-2/3 rounded bg-emerald-100" />
              <div className="mt-3 h-4 w-full rounded bg-slate-200" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-1/3 rounded bg-slate-200" />
            </article>
          ))}
        </>
      )}

      {!loading && announcements.map((item) => (
        <article key={item.id} className="card">
          <h2 className="text-lg font-bold text-soil">{item.title}</h2>
          <p className="mt-2 text-sm">{item.details}</p>
          <p className="mt-2 text-xs text-slate-500">Date: {item.dateLabel || item.postedDate}</p>
        </article>
      ))}
    </div>
  );
}
