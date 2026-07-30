import { generateAvatarColor, getInitials } from '@/presentation/utils';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  name: string;
  size?: Size;
  className?: string;
}

const sizes: Record<Size, string> = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
};

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const color = generateAvatarColor(name);
  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-soft',
        sizes[size],
        color,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
