import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  icon: Icon,
  loading = false,
  ...props
}, ref) => {
  const inputVariants = {
    initial: { scale: 1 },
    error: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } }
  };

  return (
    <div className="relative">
      <motion.div
        initial="initial"
        animate={error ? "error" : "initial"}
        variants={inputVariants}
        className="relative"
      >
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 