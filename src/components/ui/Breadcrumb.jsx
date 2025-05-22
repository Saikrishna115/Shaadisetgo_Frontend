import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [], className = '', ...props }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Generate breadcrumb items from path if not provided
  const breadcrumbItems = items.length > 0 ? items : pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path
    };
  });

  return (
    <nav
      className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}
      {...props}
    >
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          <ChevronRight className="h-4 w-4" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="font-medium text-foreground">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 