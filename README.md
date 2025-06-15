# IAESTE LCMU InternApp

A modern, full-featured web application for managing IAESTE internships at Manipal University. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB, it streamlines the workflow for interns, Local Committee (LC) members, and Incoming Co-ordinators.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The IAESTE LCMU InternApp is designed to simplify and digitize the management of international internships. It provides dashboards and tools for:
- Interns: Access essential info, discounts, emergency contacts, and more.
- LC Members: Manage intern checklists, slots, and local operations.
- Admins: Oversee all users, slots, and statistics.

## Features
- **Role-based dashboards** for Interns, LCs, and Admins
- **Intern SRO Checklist**: Track onboarding and compliance
- **Slot Management**: Assign and monitor internship slots
- **Emergency & Essentials**: Quick access to vital info
- **Discounts & Nearby**: Explore local offers and places
- **Authentication**: Secure login for all roles
- **Progressive Web App (PWA)** support
- **Responsive UI**: Mobile-first, accessible design

## Tech Stack
- **Frontend**: Next.js (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB (via Mongoose)
- **Auth**: next-auth
- **UI**: Shadcn UI, Lucide Icons, Framer Motion
- **PWA**: next-pwa

## Folder Structure
```
app/                # Main app pages and API routes
  api/              # REST API endpoints (admins, interns, lcs, slots, etc.)
  dashboard/        # User dashboards
  ...
components/         # Reusable React components (admin, intern, lc, ui)
hooks/              # Custom React hooks
lib/                # Utilities and database helpers
public/             # Static assets (images, icons, manifest)
```

## Getting Started
1. **Install dependencies:**
   ```bash
   pnpm install
   # or npm install, yarn install, bun install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in required values (MongoDB URI, Auth secrets, etc.)
3. **Run the development server:**
   ```bash
   pnpm dev
   # or npm run dev, yarn dev, bun dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- **Interns**: Sign in to view your dashboard, checklists, essentials, and more.
- **LCs/Admins**: Access management dashboards, update checklists, assign slots, and view statistics.
- **PWA**: Install the app on your device for offline access.

## Contributing
1. Fork this repo and create a feature branch.
2. Add/modify code with clear documentation (use JSDoc/TSDoc for TypeScript).
3. Run `pnpm lint` and ensure all checks pass.
4. Submit a pull request with a clear description.

## License
This project is for IAESTE Manipal University use. Contact the maintainers for licensing details.

---

> For more details, see the codebase and inline documentation.
