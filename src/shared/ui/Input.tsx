import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          autoComplete="off"
          className={cn(
            'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition',
            'focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...rest}
        />
        {error && (
          <span id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';