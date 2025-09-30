# Poetry timeline website

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/page1/v0-poetry-timeline-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/bXx1IvXuTZ1)

## Overview

This is a poetry timeline website showcasing Chinese poets and their works in a chronological format. The project was initially built with [v0.app](https://v0.app) and continuously synced with deployments. It's hosted on the Vercel platform and provides a visual timeline interface to help users understand the history of Chinese poetry.

📖 [中文版本 README](README.zh-CN.md)

### Key Features

- Interactive timeline visualization of Chinese poets across dynasties
- Detailed profiles for poets with biographical information
- Extensive collection of classical Chinese poems with translations and analysis
- Advanced search functionality to find poets, dynasties, or specific poems
- Responsive design that works on all device sizes
- Dark/light theme support
- Visitor analytics and page view tracking

## Technology Stack

### Frontend
- [Next.js 14](https://nextjs.org/) with App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) components
- [React](https://reactjs.org/)

### Backend & Database
- [Supabase](https://supabase.io/) (PostgreSQL)
- [Vercel Analytics](https://vercel.com/analytics)

### Data Sources
- Chinese poetry datasets from [chinese-poetry/chinese-poetry](https://github.com/chinese-poetry/chinese-poetry)
- AI-generated content for translations, backgrounds, and appreciation sections
- Manually curated poet biographies and dynasty information

## Data Model

The project uses three primary data entities stored in PostgreSQL tables:

1. **Dynasties** - Historical Chinese dynasties with time periods and descriptions
2. **Poets** - Chinese poets with biographical information, birth/death years, and dynasty affiliations
3. **Poems** - Classical Chinese poems with content, translations, appreciation notes, and creation backgrounds

## Analytics and Statistics

The website includes comprehensive analytics capabilities:

- Site-wide view counting
- Per-page view tracking
- Unique visitor identification using secure SHA-256 hashing
- Daily visit statistics
- Real-time analytics API

All analytics data is stored in dedicated Supabase tables and accessed through secure API routes.

## Deployment

Your project is live at:

**[https://vercel.com/page1/v0-poetry-timeline-website](https://vercel.com/page1/v0-poetry-timeline-website)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/bXx1IvXuTZ1](https://v0.app/chat/projects/bXx1IvXuTZ1)**

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables for Supabase connection
4. Run the development server with `pnpm dev`

### Scripts

The project includes various data processing scripts for importing and generating content:

- SQL migration scripts for database setup
- Data importers for Chinese poetry datasets
- AI content generation scripts using various LLM APIs
- Utility scripts for data processing and enhancement

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository