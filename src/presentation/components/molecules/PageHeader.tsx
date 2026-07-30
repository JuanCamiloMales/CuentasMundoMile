import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  back?: boolean;
  className?: string;
}

export function PageHeader({ title, subtitle, right, back, className = '' }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header
      className={[
        'safe-top sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3',
        className,
      ].join(' ')}
    >
      {back ? (
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
        >
          <ChevronLeft size={22} />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-slate-900">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
