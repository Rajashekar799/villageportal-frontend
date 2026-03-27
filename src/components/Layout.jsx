import { Home, Info, Bell, Phone, Store, Image, FileWarning, MapPinned, Shield } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/about', label: 'About', icon: Info },
  { to: '/announcements', label: 'Updates', icon: Bell },
  { to: '/contacts', label: 'Contacts', icon: Phone },
  { to: '/shops', label: 'Shops', icon: Store },
  { to: '/gallery', label: 'Gallery', icon: Image },
  { to: '/complaint', label: 'Complaint', icon: FileWarning },
  { to: '/map', label: 'Map', icon: MapPinned },
  { to: '/admin', label: 'Admin', icon: Shield }
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg">🌾</span>
            <span>
              <span className="block text-base font-extrabold text-leaf leading-tight">Pegadapalli Village Portal</span>
              <span className="block text-[11px] font-semibold text-slate-500">Jaipur Mandal • Mancherial</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        {children}

        <footer className="mt-6 mb-20 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-xs text-slate-600 shadow-card">
          <p className="font-semibold text-soil">Terms and Conditions apply.</p>
          <p className="mt-1">
            Warning: Any false or misleading information may be reviewed and removed by admin.
          </p>
          <p className="mt-1">
            Please utilize this portal responsibly and for meaningful community usage.
          </p>
          <p className="mt-2">© 2026 Pegadapalli Village Portal. All rights reserved.</p>
          <p className="mt-1 font-semibold text-leaf">Developed and maintained by Rajashekar Rikkula.</p>
        </footer>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-emerald-100 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto grid max-w-5xl grid-cols-4 gap-1 p-2 sm:grid-cols-9">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center rounded-xl text-[11px] font-bold transition ${
                    isActive ? 'bg-emerald-100 text-leaf shadow-sm' : 'text-slate-600'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
