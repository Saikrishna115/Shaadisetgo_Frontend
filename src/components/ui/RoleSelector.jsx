import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Crown } from 'lucide-react';

const roles = [
  {
    id: 'customer',
    name: 'Customer',
    description: 'Looking to plan my wedding',
    icon: User
  },
  {
    id: 'vendor',
    name: 'Vendor',
    description: 'Offering wedding services',
    icon: Users
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Platform administrator',
    icon: Crown,
    restricted: true
  }
];

const RoleSelector = React.forwardRef(({ value, onChange, error, className = '', ...props }, ref) => {
  return (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}
      ref={ref}
      {...props}
    >
      {roles
        .filter(role => !role.restricted)
        .map((role) => (
          <motion.label
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex flex-col gap-2 p-4 rounded-xl cursor-pointer
              border-2 transition-all duration-200
              ${value === role.id 
                ? 'border-primary bg-primary/5 shadow-lg' 
                : 'border-border hover:border-primary/50 hover:bg-accent/5'
              }
              ${error ? 'border-destructive' : ''}
            `}
          >
            <input
              type="radio"
              name="role"
              value={role.id}
              checked={value === role.id}
              onChange={e => onChange(e.target.value)}
              className="sr-only"
            />
            
            <div className="flex items-start gap-4">
              <div className={`
                p-2 rounded-lg 
                ${value === role.id ? 'bg-primary text-primary-foreground' : 'bg-accent'}
              `}>
                {React.createElement(role.icon, { className: 'h-5 w-5' })}
              </div>
              <div>
                <div className="font-medium">{role.name}</div>
                <div className="text-sm text-muted-foreground">
                  {role.description}
                </div>
              </div>
            </div>

            {value === role.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"
              />
            )}
          </motion.label>
        ))}
    </div>
  );
});

export default RoleSelector; 