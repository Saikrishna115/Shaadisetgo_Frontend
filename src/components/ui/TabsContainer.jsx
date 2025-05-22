import React from 'react';
import { motion } from 'framer-motion';

const TabsContainer = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Tab Headers */}
      <div className="flex space-x-1 rounded-lg bg-accent/10 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium
              transition-all duration-200
              ${activeTab === tab.id 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {tab.icon && React.createElement(tab.icon, { className: 'h-4 w-4' })}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative rounded-lg border bg-card p-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabsContainer; 