# Sandbox Hotel Site

A static hotel website hosted on Cloudflare Workers.

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Wrangler CLI

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd sandbox-hotel-site
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your Cloudflare credentials
```

## Development

Start the development server with local preview:
```bash
npm run dev
```

The site will be available at `http://localhost:8787`

## Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Project Structure

```
├── index.html          # Home page
├── privacy.html        # Privacy policy
├── 404.html            # 404 error page
├── assets/             # Static assets (images, icons)
├── images/             # Image files
├── wrangler.jsonc      # Wrangler configuration
├── package.json        # Node dependencies
└── _redirects          # Route redirects
```

## Configuration

Edit `wrangler.jsonc` to customize:
- Worker name and routes
- Compatibility date
- Environment variables
- Build configuration

## License

See LICENSE file for details.
