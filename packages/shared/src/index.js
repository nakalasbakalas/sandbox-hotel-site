/**
 * Shared utilities for Sandbox Hotel
 * Export common functions and constants here
 */

// Example: Common hotel configuration
export const HOTEL_CONFIG = {
  name: 'Sandbox Hotel',
  currency: 'USD',
  timezone: 'UTC',
};

// Example: Utility function
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: HOTEL_CONFIG.currency,
  }).format(amount);
}
