import React from 'react';

/**
 * Retries loading a module if it fails
 * @param {() => Promise} importFn - Import function
 * @param {number} retries - Number of retries
 * @returns {Promise} - Module import promise
 */
export function retryLazy(importFn, retries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      importFn()
        .then(resolve)
        .catch((error) => {
          retries--;
          if (retries > 0) {
            // Exponential backoff: 1s, 2s, 4s
            setTimeout(attempt, Math.pow(2, 3 - retries) * 1000);
          } else {
            reject(error);
          }
        });
    };
    attempt();
  });
}

/**
 * Creates a lazy loaded component with retry capability
 * @param {string} modulePath - Path to the module
 * @returns {React.LazyExoticComponent} - Lazy loaded component
 */
export function lazyWithRetry(modulePath) {
  return React.lazy(() => retryLazy(() => import(/* webpackChunkName: "[request]" */ `../${modulePath}`)));
} 