import { Link } from 'react-router-dom';
import { Bell, FileWarning, Image, Info, MapPinned, Phone, Store } from 'lucide-react';
import { villageInfo } from '../data/fallbackData';

const quickLinks = [
  { to: '/about', label: 'About Village', icon: Info },
  { to: '/announcements', label: 'Announcements', icon: Bell },
  { to: '/contacts', label: 'Contacts', icon: Phone },
  { to: '/shops', label: 'Shops & Services', icon: Store },
  { to: '/gallery', label: 'Village Gallery', icon: Image },
  { to: '/complaint', label: 'Complaint Form', icon: FileWarning },
  { to: '/map', label: 'Village Map', icon: MapPinned }
];

export default function HomePage() {
  return (
    <div className="space-y-5">
      <section className="card overflow-hidden p-0">
        <img
          src="/image.png"
          alt="Village landscape"
          className="w-full max-h-[420px] bg-slate-900/90 object-contain"
        />
        <div className="p-4">
          <h1 className="text-2xl font-extrabold text-leaf">Welcome to {villageInfo.name}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            పెగడపల్లి గ్రామం పోర్టల్ అనేది గ్రామ సమాచారము, ప్రకటనలు, సంప్రదింపులు, స్థానిక సేవలు,
            మరియు పబ్లిక్ ఫిర్యాదుల కొరకు ఒక సాదాసీదా డిజిటల్ పోర్టల్.
          </p>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Quick Navigation</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="primary-btn w-full gap-2 text-left">
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Village Snapshot</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <p><strong>Mandal:</strong> {villageInfo.mandal}</p>
          <p><strong>District:</strong> {villageInfo.district}</p>
          <p><strong>State:</strong> {villageInfo.state}</p>
          <p><strong>Pin Code:</strong> {villageInfo.pinCode}</p>
        </div>
        <p className="mt-2 text-sm">{villageInfo.distance}</p>
      </section>

      <section className="card">
        <h2 className="section-title">Location Map</h2>
        <iframe
          title="Pegadapalli Location"
          className="mt-3 h-64 w-full rounded-xl border"
          loading="lazy"
          src="https://www.google.com/maps?q=18.8240,79.5849&z=13&output=embed"
        />
      </section>
    </div>
  );
}
