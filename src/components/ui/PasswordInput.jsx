import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordInput = React.forwardRef(({ error, success, className = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Lock className="h-4 w-4" />
      </div>
      <input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={`
          w-full pl-10 pr-12 py-2 rounded-md border bg-background
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${error ? 'border-destructive' : success ? 'border-green-500' : 'border-input'}
          ${className}
        `}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-12 top-1/2 -translate-y-1/2"
        >
          <div className={`h-2 w-2 rounded-full ${error ? 'bg-destructive' : 'bg-green-500'}`} />
        </motion.div>
      )}
    </div>
  );
});

export default PasswordInput; 