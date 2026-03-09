# Sandbox Hotel - Shared

Shared utilities, constants, and types for the Sandbox Hotel monorepo.

## Usage

Import from `@sandbox-hotel/shared`:

```javascript
import { HOTEL_CONFIG, formatCurrency } from '@sandbox-hotel/shared';

console.log(HOTEL_CONFIG.name);
console.log(formatCurrency(100));
```

## Contents

- `HOTEL_CONFIG` - Global hotel configuration
- `formatCurrency()` - Format prices in hotel currency
- More utilities can be added as needed
