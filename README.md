# BookHeaven

A modern, full-stack online bookstore application with rich features for book lovers.

<!--toc:start-->

- [BookHeaven](#bookheaven)
  - [Video demo](#video-demo)
    - [Overall usage](#overall-usage)
    - [Book related things](#book-related-things)
    - [Admin dashboard](#admin-dashboard)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Authentication \& Payments](#authentication--payments)
    - [Monitoring \& Media](#monitoring--media)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Development Setup](#development-setup)

## Video demo

### Overall usage

Search over books with multiple criteria search, order creation and payment

<https://github.com/user-attachments/assets/12a09027-1fe9-4da0-b9f6-98a1d2937173>

### Book related things

Book shelves, user dashboard, etc

<https://github.com/user-attachments/assets/1950a094-fe03-4a54-94e4-cf0283bc8d52>

### Admin dashboard

Example of adding a book from existing ISBN, auto parsing needed book information from open APIs

<https://github.com/user-attachments/assets/12c15611-c115-405a-bb4a-b999fa43db21>

## Key Features

- 📚 **Comprehensive Book Management**

  - Browse and search books by various criteria
  - View detailed book information including editions
  - Book ratings and reviews system

- 📑 **Personalized Bookshelves**

  - Create and manage custom bookshelves
  - Track reading progress
  - Organize books by categories

- 👥 **User System**

  - Secure authentication with Clerk (Google, Facebook, etc.)
  - User profiles with avatars
  - Like other books, follow authors, like other user reviews or shelves
  - Admin dashboard for content management

- 💳 **E-commerce Capabilities**

  - Secure checkout with Stripe integration
  - Order management and tracking
  - Asynchronous payment processing via webhooks and Stripe
  - Stock management for book editions

- 🖼️ **Media Management**
  - Image uploads for books, authors, etc. on admin dashboard
  - Secure storage with UploadThing

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Tanstack Query** - Data fetching and caching
- **React Hook Form** - Form handling with Zod validation

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Drizzle ORM** - Type-safe SQL query builder
- **Zod** - Schema validation

### Database

- **PostgreSQL** - Relational database (via Neon)
- **Drizzle Migrations** - Database schema management

### Authentication & Payments

- **Clerk** - Authentication and user management
- **Stripe** - Payment processing with webhook integration

### Monitoring & Media

- **Sentry** - Error tracking and monitoring
- **UploadThing** - File uploads and storage

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Clerk account
- Stripe account
- UploadThing account
- Sentry account (optional)

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookheaven.git
cd bookheaven
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Fill in the environment variables in the `.env` file:

```
DATABASE_URL="postgres://postgres:postgres@localhost:5432/bookheaven"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

SENTRY_AUTH_TOKEN=your_sentry_auth_token
UPLOADTHING_TOKEN=your_uploadthing_token
```

5. Start the development server:

```bash
pnpm dev
```

The application will be available at <http://localhost:3000>
