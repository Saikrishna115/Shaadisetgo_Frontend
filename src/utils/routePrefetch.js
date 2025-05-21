import routes from '../routes';

/**
 * Prefetches a specific route's component
 * @param {string} path - Route path to prefetch
 * @returns {Promise} - Component loading promise
 */
export const prefetchRoute = async (path) => {
  const route = routes.find(r => r.path === path);
  if (!route) return null;

  try {
    const Component = route.component;
    await Component.preload();
    return true;
  } catch (error) {
    console.warn(`Failed to prefetch route: ${path}`, error);
    return false;
  }
};

/**
 * Prefetches a group of routes
 * @param {string} group - Route group to prefetch (e.g., 'auth', 'vendor')
 * @returns {Promise<boolean[]>} - Array of prefetch results
 */
export const prefetchRouteGroup = async (group) => {
  const groupRoutes = routes.filter(r => r.group === group);
  return Promise.all(groupRoutes.map(route => prefetchRoute(route.path)));
};

/**
 * Prefetches likely next routes based on current route
 * @param {string} currentPath - Current route path
 */
export const prefetchLikelyRoutes = async (currentPath) => {
  const currentRoute = routes.find(r => r.path === currentPath);
  if (!currentRoute) return;

  // Prefetch routes in the same group
  if (currentRoute.group) {
    await prefetchRouteGroup(currentRoute.group);
  }

  // Prefetch specific routes based on current route
  switch (currentPath) {
    case '/':
      // From home, users likely go to login, register, or vendor list
      await Promise.all([
        prefetchRoute('/login'),
        prefetchRoute('/register'),
        prefetchRoute('/vendors'),
      ]);
      break;
    case '/login':
      // After login, users might go to dashboard or profile
      await Promise.all([
        prefetchRoute('/dashboard'),
        prefetchRoute('/profile'),
      ]);
      break;
    case '/vendors':
      // From vendor list, users likely view vendor details
      await prefetchRouteGroup('vendors');
      break;
    default:
      break;
  }
}; 