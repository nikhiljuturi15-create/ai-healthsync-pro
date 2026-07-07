import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-dark-400',
  busy: 'bg-error-500',
  away: 'bg-warning-500',
};

export function Avatar({ src, alt, name, size = 'md', status, className = '' }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className={`
          ${sizes[size]}
          rounded-full overflow-hidden
          bg-gradient-to-br from-primary-400 to-primary-600
          flex items-center justify-center
          text-white font-semibold
          ring-2 ring-white dark:ring-dark-700
          shadow-md
        `}
      >
        {src ? (
          <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            w-3 h-3 rounded-full
            ring-2 ring-white dark:ring-dark-800
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ avatars, max = 4, size = 'md' }: AvatarGroupProps) {
  const display = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {display.map((avatar, index) => (
        <Avatar key={index} src={avatar.src} name={avatar.name} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${sizes[size]}
            rounded-full bg-dark-200 dark:bg-dark-700
            flex items-center justify-center
            text-dark-600 dark:text-dark-300 font-medium
            ring-2 ring-white dark:ring-dark-800
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
