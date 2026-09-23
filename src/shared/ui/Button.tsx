import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn, focusRing } from '@/shared/lib';

type Variant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(base, focusRing, variants[variant], className)}
      {...rest}
    />
  ),
);

Button.displayName = 'Button';