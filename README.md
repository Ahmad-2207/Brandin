# Brandly - AI-Based Brand Influencer Platform

A comprehensive platform connecting brands and influencers using AI-driven matching, secure escrow payments, mutual agreement flows, and real-time project management.

## Project Structure

```
FYP - AD/
├── brandin/           # Frontend (React, Tailwind CSS)
└── brandy-backend/    # Backend (Node.js, Express, MongoDB, Socket.io, Stripe)
```

## Features

- **AI Influencer Matching**: Optimized pairing of brands with relevant influencers.
- **Mutual Agreement Flow**: Mandatory contract signing before project execution.
- **Secure Escrow**: Automated budget protection and deliverable-based payouts via Stripe.
- **Real-Time Dashboards & Chat**: Instant synchronization of tasks, notifications, and project status.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB
- Redis (optional for queuing / caching)

### Frontend Setup

```bash
cd brandin
npm install
npm start
```

### Backend Setup

```bash
cd brandy-backend/server
npm install
npm run dev
```
