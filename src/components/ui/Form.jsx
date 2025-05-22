import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const FormGroup = ({ children, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`} {...props}>
    {children}
  </div>
);

export const FormLabel = ({ children, required, className = '', ...props }) => (
  <label
    className={`block text-sm font-medium text-foreground ${className}`}
    {...props}
  >
    {children}
    {required && <span className="text-destructive ml-1">*</span>}
  </label>
);

export const FormInput = React.forwardRef(
  ({ error, success, className = '', ...props }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-md border bg-background
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${error ? 'border-destructive' : success ? 'border-green-500' : 'border-input'}
          ${className}
        `}
        {...props}
      />
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          {error ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </motion.div>
      )}
    </div>
  )
);

export const FormError = ({ children }) => (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-sm text-destructive mt-1"
  >
    {children}
  </motion.p>
);

export const FormSuccess = ({ children }) => (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-sm text-green-500 mt-1"
  >
    {children}
  </motion.p>
);

export const FormButton = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      loading = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${loading ? 'relative !text-transparent' : ''}
          ${className}
        `}
        disabled={loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-5 w-5 rounded-full border-2 border-current border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
        {children}
      </button>
    )
  }
);

export const FormSelect = React.forwardRef(
  ({ error, success, children, className = '', ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-md border bg-background
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${error ? 'border-destructive' : success ? 'border-green-500' : 'border-input'}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-y-0 right-8 flex items-center"
        >
          {error ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </motion.div>
      )}
    </div>
  )
);

export const FormTextarea = React.forwardRef(
  ({ error, success, className = '', ...props }, ref) => (
    <div className="relative">
      <textarea
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-md border bg-background
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${error ? 'border-destructive' : success ? 'border-green-500' : 'border-input'}
          ${className}
        `}
        {...props}
      />
      {(error || success) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2"
        >
          {error ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </motion.div>
      )}
    </div>
  )
);

export const FormCheckbox = React.forwardRef(
  ({ children, error, className = '', ...props }, ref) => (
    <label className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        ref={ref}
        className={`
          h-4 w-4 rounded border bg-background
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:cursor-not-allowed disabled:opacity-50
          transition-colors
          ${error ? 'border-destructive' : 'border-input'}
        `}
        {...props}
      />
      <span className="text-sm text-foreground">{children}</span>
    </label>
  )
);

export const FormDivider = ({ className = '', ...props }) => (
  <div
    className={`relative my-6 ${className}`}
    {...props}
  >
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border" />
    </div>
    {props.children && (
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {props.children}
        </span>
      </div>
    )}
  </div>
); 