
# URL Shortener

## 1. Project Overview

**URL Shortener** is a web application that allows users to shorten long URLs into unique, easy-to-share short links. The system also provides analytics for each short URL, including click statistics.

**Problem Solved:**
- Makes sharing long URLs easier on social media, email, and documents.
- Tracks the effectiveness of links via click analytics.

---

## 2. Features Implemented

- Shorten long URLs into unique short URLs
- Automatically returns the same short URL if the original URL already exists
- Redirects from short URL to the original URL
- Tracks and counts the number of clicks for each short URL
- API to retrieve analytics (original URL, click count)
- Simple, user-friendly web interface
- Analytics page to check statistics for any short URL

---

## 3. Tech Stack

**Frontend:**
- Next.js (App Router, React 19)
- Tailwind CSS

**Backend:**
- Node.js (via Next.js API Routes - Serverless)
- Next.js API Routes
- Prisma ORM

**Database:**
- PostgreSQL (Supabase)

**Others:**
- TypeScript
- Lucide React (icons)
- dotenv (environment variable management)
- Base62 encoding (for short URL generation)

---

## 4. Architecture Overview

- **Client:** Next.js UI for entering URLs, receiving short URLs, viewing history, and checking analytics.
- **API:**
	- `/api/shorten`: Accepts a URL and returns a short URL (POST)
	- `/[shortCode]`: Redirects from short URL to original URL (GET)
	- `/api/stats/[code]`: Returns click analytics (GET)
- **Database (PostgreSQL via Supabase):** 
    - Stores URL mappings and click data
	- **UrlShortener**
		- `id`, `original` (unique), `shortUrl` (unique), `clicks`, `createdAt`
	- **ClickLog**
		- `id`, `urlId`, `ip`, `userAgent`, `createdAt`
	- One URL has many click logs (1:N)

**Main Flow:**
1. User enters a URL → Sends request to `/api/shorten`.
2. API checks, creates, or returns the short URL.
3. User visits the short URL → `/[shortCode]` API checks, increments click count, redirects to the original URL.
4. User checks analytics via the analytics page or `/api/stats/[code]` API.

---

## 5. API Design

### 1. Shorten URL
- **POST** `/api/shorten`
- **Request:**
	```json
	{ "url": "https://example.com/..." }
	```
- **Response:**
	```json
	{ "shortUrl": "http://localhost:3000/1" }
	```

### 2. Redirect Short URL
- **GET** `/{shortCode}`
- **Function:** Redirects to the original URL and increments click count.

### 3. Get Analytics
- **GET** `/api/stats/{code}`
- **Response:**
	```json
	{
		"originalUrl": "https://example.com/...",
		"clicks": 42
	}
	```

---

## 6. Data Model

### Table `UrlShortener`
- `id` (Int, PK, auto increment): Unique identifier
- `original` (String, unique): Original URL
- `shortUrl` (String, unique): Shortened code (base62)
- `clicks` (Int): Click count
- `createdAt` (DateTime): Creation date

### Table `ClickLog`
- `id` (String, PK, uuid): Unique identifier
- `urlId` (Int, FK): References `UrlShortener`
- `ip` (String): Clicker's IP address
- `userAgent` (String): Browser info
- `createdAt` (DateTime): Click timestamp

**Relationship:**
- One `UrlShortener` has many `ClickLog` (1-n)

---

## 7. How to Run

### 1. Clone the repository
```bash
git clone https://github.com/KhanhLy254/url_shortener.git
cd url_shortener
```

### 2. Install dependencies
```bash
npm install
# or: pnpm install / yarn install
```

### 3. Configure environment variables
- Create a `.env` file based on the template below:
	```
	DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db>?pgbouncer=true"
	DIRECT_URL="postgresql://<user>:<password>@<host>:<port>/<db>"
	BASE_URL="http://localhost:3000"
	```

### 4. Migrate the database
```bash
npx prisma migrate deploy
# or: npx prisma db push
```

### 5. Start the development server
```bash
npm run dev
```
- Visit: http://localhost:3000

---



