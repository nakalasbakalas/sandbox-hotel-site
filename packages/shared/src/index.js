/**
 * Shared utilities for Sandbox Hotel
 * Export common functions and constants here
 */

export const HOTEL_CONFIG = {
  name: 'Sandbox Hotel',
  currency: 'THB',
  timezone: 'Asia/Bangkok',
};

export function formatCurrency(amount) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: HOTEL_CONFIG.currency,
  }).format(amount);
}
