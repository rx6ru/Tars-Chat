# Tars Chat

A real-time live chat messaging application built for the Tars Full Stack Engineer Internship Coding Challenge (2026).

## Overview

Tars Chat is a complete, feature-rich messaging platform that facilitates real-time communication between registered users. It supports both direct one-on-one messaging and group conversations, with a focus on a highly responsive, modern user interface.

## Features Implemented

The application fulfills 100% of the core and optional requirements for the coding challenge:

### Core Requirements
1. **Authentication:** Secure user registration, login, and profile synchronization using Clerk and Convex.
2. **User List & Search:** Real-time search to discover and initiate conversations with other registered users.
3. **Direct Messaging:** Private, real-time conversations utilizing Convex subscriptions, alongside a dynamic sidebar.
4. **Message Timestamps:** Context-aware timestamps (Time-only for today, Date+Time for previous days, Year included for past years).
5. **Empty States:** Graceful handling and informative messaging for empty search results, empty conversations, and empty chat histories.
6. **Responsive Layout:** Adaptive user interface offering a side-by-side view on desktop and a dedicated slide-over panel navigation on mobile.
7. **Online Status:** Real-time presence indicators to show which users currently have the application open.
8. **Typing Indicators:** Animated indicators representing active typing state that automatically resolve after inactivity.
9. **Unread Message Count:** Real-time badge indicators for unread messages that clear automatically upon viewing the conversation.
10. **Smart Auto-Scroll:** Intelligent scroll handling that automatically snaps to new messages unless the user is actively reading historical context.

### Optional Requirements
11. **Soft Delete Messages:** Users can delete their sent messages, displaying a "This message was deleted" placeholder across all clients.
12. **Message Reactions:** Users can append and toggle emoji reactions to individual messages, complete with aggregate counts.
13. **Loading & Error States:** Comprehensive skeleton loaders for asynchronous data fetching and robust error boundary handling.
14. **Group Chat:** Complex multi-user conversations featuring dynamic group creation, member tracking, and live participant lists.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Backend & Database:** Convex (Serverless, Real-time)
- **Authentication:** Clerk
- **Styling:** Tailwind CSS, shadcn/ui
- **Icons:** Lucide React

## Local Development

### Prerequisites

Ensure you have Node.js (version 18 or higher) and npm installed. You will also need active accounts with Convex and Clerk to retrieve the necessary environment variables.

### Environment Setup

Create a `.env.local` file in the root directory and populate it with your Clerk credentials:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

You must also configure a Clerk Webhook to synchronize user data with Convex. The webhook endpoint should point to `<your_convex_http_url>/clerk-webhook`. The webhook secret must be stored in your Convex Dashboard as `CLERK_WEBHOOK_SECRET`.

### Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Convex development server (this will prompt you to log in and configure your Convex project):
   ```bash
   npx convex dev
   ```

3. In a separate terminal, start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

## Deployment

The application is optimized for deployment on Vercel. 

1. Ensure the Vercel project is linked to your GitHub repository.
2. In the Vercel project settings, configure the environment variables required by Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`).
3. The build command in `package.json` (`npx convex deploy --cmd 'next build'`) handles the sequential deployment of the Convex backend followed by the Next.js frontend.
4. Ensure your Clerk production instance has the correct webhook configured to point to your deployed Convex HTTP endpoint.
