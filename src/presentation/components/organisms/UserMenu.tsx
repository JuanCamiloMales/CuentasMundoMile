import { LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { AuthUser } from '@/domain';
import { getInitials, generateAvatarColor } from '@/presentation/utils';

export interface UserMenuProps {
  user: AuthUser;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const displayName = user.displayName ?? user.email;
  const color = generateAvatarColor(user.email);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-white p-1 pr-2 shadow-soft transition hover:bg-slate-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            className="h-8 w-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${color}`}
            aria-hidden
          >
            {getInitials(displayName)}
          </div>
        )}
        <ChevronDown size={14} className="text-slate-500" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.displayName ?? 'Sin nombre'}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}