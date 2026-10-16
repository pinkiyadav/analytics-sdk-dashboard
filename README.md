# Analytics SDK & Dashboard

A full-stack analytics application built as a Senior Software Engineer assignment. It demonstrates browser event tracking, server-side event tracking, event storage, and an analytics dashboard using a restaurant demo application.

## Tech Stack

- **Frontend:** React, Vite, Recharts, JavaScript
- **Backend:** Laravel, PHP
- **Database:** MySQL
- **Analytics:** Reusable browser tracking helper and REST API
- **Demo application:** Urban Bites restaurant

## Features

- Browser page-view tracking
- Custom event tracking, including add-to-cart activity
- Visitor and session identifiers
- Laravel API for receiving analytics events
- MySQL event storage
- Dashboard summary metrics
- Popular pages report
- Page-view traffic chart
- Date-range filtering

## Architecture

1. The React restaurant application generates page-view and custom events.
2. The analytics helper adds visitor ID, session ID, page URL, event properties, and event timestamp.
3. The Laravel API validates incoming events.
4. Valid events are stored in the MySQL `analytics_events` table.
5. The dashboard requests aggregated metrics from the Laravel API and displays them using React and Recharts.

**Event flow:**

`React App → Analytics SDK → Laravel REST API → MySQL → Dashboard API → React Dashboard`

## Prerequisites

- PHP and Composer
- Node.js and npm
- MySQL
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/pinkiyadav/analytics-sdk-dashboard.git
cd analytics-sdk-dashboard
```

Replace `pinkiyadav` with your GitHub username.

### 2. Configure the React application

Create a `.env` file in the repository root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Install dependencies and start React:

```bash
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

### 3. Configure Laravel

```bash
cd analytics-api
composer install
```

Create the local environment file from the example:

```bash
copy .env.example .env
```

Configure your local MySQL connection in `analytics-api/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=analytics_db
DB_USERNAME=root
DB_PASSWORD=
```

Create the `analytics_db` database in MySQL, then run:

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

The API normally runs at `http://127.0.0.1:8000`.

Keep the React and Laravel development servers running in separate terminals.

## API Endpoints

### Receive an analytics event

`POST /api/analytics/events`

Example request:

```json
{
  "event_name": "page_view",
  "visitor_id": "visitor-example",
  "session_id": "session-example",
  "page_url": "/",
  "properties": {
    "title": "Urban Bites"
  },
  "occurred_at": "2026-10-16T08:00:00.000Z"
}
```

A successful request returns HTTP `201` and the saved event.

### Retrieve dashboard metrics

`GET /api/analytics/dashboard`

Optional date parameters:

`GET /api/analytics/dashboard?start_date=2026-10-10&end_date=2026-10-16`

The response includes summary metrics, popular pages, and page-view traffic.

## Testing

1. Start MySQL.
2. Start the Laravel server.
3. Start the React development server.
4. Open the restaurant application and navigate through the page.
5. Add a product to the cart and trigger other implemented events.
6. Inspect the browser Network tab for requests to `/api/analytics/events`.
7. Check that events are stored in `analytics_events`.
8. Open the dashboard and confirm that metrics and charts update.
9. Test a date range and verify the corresponding API response.

You can also test the event endpoint directly with Postman.

## Assumptions and Key Decisions

- Browser tracking is implemented as a reusable JavaScript helper rather than being tightly coupled to the dashboard.
- The Laravel API validates event payloads before saving them.
- MySQL stores individual events, allowing dashboard metrics to be calculated from the stored records.
- Visitor IDs are persisted in browser local storage, while session IDs use session storage.
- React and Laravel are developed and run as separate applications during local development.
- The dashboard reads its data through a dedicated API endpoint.

## Trade-offs

- A lightweight custom tracking helper keeps the assignment simple and easy to understand, but it does not provide all the features of a production analytics SDK.
- Dashboard metrics are calculated from stored events. Large datasets would benefit from database optimization, caching, pre-aggregation, or a dedicated analytics data store.
- Browser storage provides basic visitor identification, not guaranteed real-world identity. Clearing browser storage or switching devices can create new identifiers.
- The local development configuration is intended for demonstration, not production deployment.

## Known Limitations

- The project requires the React frontend, Laravel API, and MySQL database to be available locally.
- Local `.env` configuration must be created separately on each machine.
- Browser event delivery can fail when the API is unavailable or the network request is blocked.
- Visitor identification is browser-based and should not be interpreted as verified user identity.
- Authentication, production deployment, advanced bot filtering, consent management, and high-volume event processing should be addressed before production use, if required by the deployment context.
- Server-side tracking should be connected to real backend business actions before treating events as authoritative.

## Future Improvements

- Automated tests for SDK events, API validation, and dashboard calculations
- Authentication and access control for dashboard data
- Production deployment with HTTPS and secure configuration
- Event batching, retry handling, and duplicate-event protection
- Better date-range validation and database indexing
- Consent-aware tracking and retention policies


## Author

**Pinki Yadav**

Senior PHP, WordPress, Laravel, and web development professional.

GitHub: https://github.com/pinkiyadav
