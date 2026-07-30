import { NavLink } from 'react-router-dom';
import { Home, Users } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Clientes', icon: Home },
  { to: '/resumen', label: 'Resumen', icon: Users },
] as const;

export function TabBar() {
  return (
    <nav className="safe-bottom sticky bottom-0 z-20 grid grid-cols-2 border-t border-slate-200 bg-white">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) =>
            [
              'flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition',
              isActive ? 'text-whatsapp-accent' : 'text-slate-500 hover:text-slate-700',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              <t.icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              <span>{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
