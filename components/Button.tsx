import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  href,
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-block text-center font-medium rounded-full transition-all duration-300 hover:scale-105';

  const sizeStyles = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg'
  };

  const variantStyles = {
    primary: 'bg-charcoal text-soft-white hover:bg-opacity-90 shadow-lg hover:shadow-xl',
    secondary: 'bg-gold text-charcoal hover:bg-opacity-90 shadow-lg hover:shadow-xl',
    outline: 'bg-transparent border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-soft-white'
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
