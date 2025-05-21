import React, { useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { prefetchRoute, prefetchLikelyRoutes } from '../../utils/routePrefetch';

const NavigationLink = ({ to, children, className, prefetchOnHover = true, ...props }) => {
  const location = useLocation();

  const handleMouseEnter = useCallback(() => {
    if (prefetchOnHover) {
      prefetchRoute(to);
    }
  }, [to, prefetchOnHover]);

  // Prefetch likely next routes when the current route changes
  useEffect(() => {
    prefetchLikelyRoutes(location.pathname);
  }, [location.pathname]);

  return (
    <Link
      to={to}
      className={className}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavigationLink; 