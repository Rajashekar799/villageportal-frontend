import { useEffect, useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { api } from '../api/client';
import { fallbackContacts } from '../data/fallbackData';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => setContacts(fallbackContacts));
  }, []);

  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="section-title">Important Contacts</h1>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {contacts.map((contact) => (
          <article key={contact.id} className="card">
            <h2 className="text-lg font-bold text-soil">{contact.name}</h2>
            <p className="text-sm text-slate-600">{contact.role}</p>
            <p className="mt-2 text-base font-semibold">{contact.phone}</p>
            <a className="primary-btn mt-3 w-full gap-2" href={`tel:${contact.phone}`}>
              <PhoneCall size={18} /> Click to Call
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
