import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeTimeframe = 'vs last month',
  loading = false,
  className = '',
  ...props
}) => {
  const isPositive = change > 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-destructive';
  const changeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-lg border bg-card p-6
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            {Icon && (
              <Icon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {value}
            </h2>
          </div>
          {typeof change !== 'undefined' && (
            <div className="mt-4 flex items-center gap-1 text-sm">
              <div className={`flex items-center gap-0.5 ${changeColor}`}>
                {React.createElement(changeIcon, { className: 'h-4 w-4' })}
                <span className="font-medium">{Math.abs(change)}%</span>
              </div>
              <span className="text-muted-foreground">
                {changeTimeframe}
              </span>
            </div>
          )}
          <div
            className="absolute inset-x-0 bottom-0 h-1"
            style={{
              background: `linear-gradient(to right, 
                ${isPositive ? '#22C55E' : '#EF4444'} ${Math.abs(change)}%, 
                transparent ${Math.abs(change)}%
              )`
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export const DashboardCardGrid = ({ children, className = '', ...props }) => (
  <div
    className={`
      grid gap-4
      grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export default DashboardCard; 