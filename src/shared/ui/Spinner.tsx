import { cn } from '@/shared/lib';

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps = {}) => (
  <span
    role="status"
    aria-label="Загрузка"
    className={cn(
      'inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900',
      className,
    )}
  />
);