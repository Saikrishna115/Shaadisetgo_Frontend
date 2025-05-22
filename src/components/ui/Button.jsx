import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-primary-foreground shadow',
    secondary: 'bg-secondary hover:bg-secondary-hover text-secondary-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
    destructive: 'bg-destructive hover:bg-destructive-hover text-destructive-foreground shadow-sm',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button; 