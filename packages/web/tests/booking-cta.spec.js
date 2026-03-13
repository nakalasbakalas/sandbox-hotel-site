import { test, expect } from "@playwright/test";
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");
const publicDir = path.join(repoRoot, "public");

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function buildSiteConfig(baseUrl, bookingEnabled = true) {
  const config = {
    MARKETING_SITE_URL: baseUrl,
    BOOKING_ENGINE_URL: bookingEnabled ? baseUrl : "",
    STAFF_APP_URL: bookingEnabled ? `${baseUrl}/staff-app` : "",
  };
  return `window.__SBX_PUBLIC_CONFIG__ = Object.freeze(${JSON.stringify(config)});\n`;
}

async function startStaticSiteServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
      if (requestUrl.pathname === "/site-config.js") {
        const bookingEnabled = requestUrl.searchParams.get("mode") !== "missing";
        const baseUrl = `http://127.0.0.1:${server.address().port}`;
        const body = buildSiteConfig(baseUrl, bookingEnabled);
        res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" });
        res.end(body);
        return;
      }

      if (requestUrl.pathname === "/availability") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<html><body data-path="availability">${requestUrl.search}</body></html>`);
        return;
      }

      let relativePath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
      relativePath = relativePath.replace(/^\/+/, "");
      const filePath = path.join(publicDir, relativePath);
      const file = await readFile(filePath);
      res.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
      res.end(file);
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  return {
    baseUrl,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  };
}

let siteServer;

test.beforeAll(async () => {
  siteServer = await startStaticSiteServer();
});

test.afterAll(async () => {
  await siteServer.close();
});

test("brochure booking CTAs deep-link into PMS consistently", async ({ page }) => {
  await page.goto(`${siteServer.baseUrl}/?lang=th&utm_source=google_business&utm_medium=cpc&utm_campaign=summer-sale`, {
    waitUntil: "networkidle",
  });

  const navBook = page.locator('[data-booking-context="nav_book"]').first();
  await expect(navBook).toHaveAttribute("href", /\/availability\?/);
  await expect(navBook).toHaveAttribute("href", /lang=th/);
  await expect(navBook).toHaveAttribute("href", /source_context=nav_book/);
  await expect(navBook).toHaveAttribute("href", /utm_campaign=summer-sale/);

  const roomCardBook = page.locator('[data-booking-context="room_card"]').first();
  await expect(roomCardBook).toHaveAttribute("href", /room_type_code=TWN/);
  await expect(roomCardBook).toHaveAttribute("href", /utm_source=google_business/);

  await page.locator("#checkin").fill("2026-04-10");
  await page.locator("#checkout").fill("2026-04-12");
  await page.locator("#guests").selectOption("2");
  await page.locator("#room").selectOption("Standard Twin");
  await page.locator("#bookingForm .ctaPrimary").click();

  await page.waitForURL(/\/availability\?/);
  expect(page.url()).toContain("check_in=2026-04-10");
  expect(page.url()).toContain("check_out=2026-04-12");
  expect(page.url()).toContain("adults=2");
  expect(page.url()).toContain("room_type_code=TWN");
  expect(page.url()).toContain("source_context=booking_form");
  expect(page.url()).toContain("utm_medium=cpc");
});

test("brochure booking CTA falls back cleanly when PMS config is missing", async ({ page }) => {
  await page.goto(`${siteServer.baseUrl}/?mode=missing`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.__SBX_PUBLIC_CONFIG__ = Object.freeze({});
    if (typeof window.syncBookingEntryPoints === "function") {
      window.syncBookingEntryPoints();
    }
  });

  const navBook = page.locator('[data-booking-context="nav_book"]').first();
  await expect(navBook).toHaveAttribute("href", "#book");
  await navBook.click();
  await page.waitForTimeout(500);
  await expect(page.locator("#checkin")).toBeFocused();
});
