# Project: "Ship It or Weep" (Working Title)

## 1. Core Features

* **User Authentication:**
  * Sign up (email/password, but X social login preferred).
  * Log in.
  * Log out.
* **Goal Management:**
  * Create a new goal:
    * Goal description (text).
    * Target completion date/schedule (e.g., daily, weekly, specific date).
  * View user's own goals.
  * View other users' public goals.
  * Mark a goal as "shipped" (completed).
  * Mark a goal as "failed" (if not shipped by the deadline).
* **Social Interactions:**
  * **Cheer:** Users can "cheer" another user's active goal.
  * **Remind:** Users can send a "reminder" to another user about their upcoming deadline.
  * **Flame:** If a user fails to ship their goal by the deadline, other users can "flame" them.
  * View interactions on a goal.
* **User Profiles:**
  * Basic profile page showing user's goals (active, shipped, failed) and stats (e.g., ship rate).
* **Activity Feed (Optional, for later):**
  * A feed showing recent goals created, shipped, or failed.

## 2. Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **UI Components:** Shadcn UI, Radix UI
* **Styling:** Tailwind CSS
* **State Management (Client):** Minimal; `react-query` for server state.
* **Data Fetching:** `react-query` for API interactions.
* **Database:** PostgreSQL (implied by `prisma/` in boilerplate).
* **Authentication:** Better Auth

## 3. Development Steps

**Phase 1: Setup & Core User Flow**

1. **Project Initialization & Basic Setup:**
    * Confirm Next.js, TypeScript, Tailwind CSS, Shadcn UI configuration.
    * Set up Prisma schema for `User` and `Goal`.
        * `User`: `id`, `email`, `name`, `password` (hashed), `createdAt`, `updatedAt`.
        * `Goal`: `id`, `userId` (FK to `User`), `description` (text), `targetDate` (DateTime), `status` (TEXT: "active", "shipped", "failed"), `createdAt`, `updatedAt`.
    * Run initial Prisma migration.
2. **Authentication:**
    * Implement sign-up, log-in, log-out (NextAuth.js with email/password).
    * Create UI components (`auth-form.tsx`) using Shadcn UI.
    * Protect routes using Next.js middleware.
3. **Goal Creation & Display (User's Own):**
    * **API Routes:**
        * `POST /api/goals`: Create new goal (auth).
        * `GET /api/goals`: Get current user's goals (auth).
    * **UI:**
        * `goal-form.tsx` (Shadcn: `Input`, `Textarea`, `DatePicker`, `Button`).
        * Page (`/dashboard` or `/my-goals`) to display user's goals (`goal-card.tsx`).
        * Use `react-query` for fetching/creating goals.
        * Wrap client components in `<Suspense>` with loading fallback.

**Phase 2: Public Goals & Basic Interactions**

4. **Public Goal Viewing:**
    * **API Routes:**
        * `GET /api/goals/public`: Get all public goals (paginated).
    * **UI:**
        * Page (`/explore` or `/all-goals`) for public goals.
        * Filtering/sorting options.
5. **Goal Status Updates:**
    * **API Routes:**
        * `PUT /api/goals/[goalId]/ship`: Mark goal as "shipped" (auth, owner).
        * `PUT /api/goals/[goalId]/fail`: Mark goal as "failed" (auth, owner or cron).
    * **UI:**
        * Buttons on `goal-card.tsx` (for own goals) to mark shipped.
        * Visual distinction for goal statuses.
6. **Basic "Cheer" Interaction:**
    * **Prisma Schema:** `Cheer` model: `id`, `userId` (FK), `goalId` (FK), `createdAt`.
    * **API Routes:**
        * `POST /api/goals/[goalId]/cheer`: Add cheer (auth).
        * `DELETE /api/goals/[goalId]/cheer`: Remove cheer (auth, original cheerer).
        * (Update `GET /api/goals/[goalId]` to include cheer count/user cheered status).
    * **UI:**
        * "Cheer" button on public `goal-card.tsx`.
        * Display cheer count.

**Phase 3: Enhanced Interactions & Profiles**

7. **"Remind" and "Flame" Interactions:**
    * **Prisma Schema:**
        * `Reminder`: `id`, `senderId` (FK), `recipientId` (FK), `goalId` (FK), `message` (optional), `createdAt`.
        * `Flame`: `id`, `senderId` (FK), `recipientId` (FK), `goalId` (FK), `message` (optional), `createdAt`.
    * **API Routes:**
        * `POST /api/goals/[goalId]/remind`: Send reminder.
        * `POST /api/goals/[goalId]/flame`: Send flame (only if goal is "failed").
    * **UI:**
        * "Remind" button for nearing deadlines.
        * "Flame" button for failed goals.
        * Consider notifications.
8. **User Profiles:**
    * **API Routes:**
        * `GET /api/users/[userId]`: Get public user profile data.
    * **UI:**
        * Dynamic route `/[username]` or `/users/[userId]`.
        * Display user's goals (categorized), cheer count, ship rate.

**Phase 4: Polish & Optional Enhancements**

9. **Styling and Responsiveness:**
    * Consistent Tailwind CSS styling.
    * Mobile-first responsive design.
10. **Error Handling & Validation:**
    * Server-side and client-side validation.
    * User-friendly error messages.
11. **Optimizations:**
    * Image optimization (if applicable).
    * Lazy loading.
    * Review Web Vitals.
12. **Automated Tasks (Cron Jobs):**
    * Job to auto-mark overdue goals as "failed".
13. **Notifications (Optional):**
    * In-app notifications for interactions or deadlines.

## 4. TypeScript & Naming Conventions

* **Directories:** `kebab-case` (e.g., `auth-wizard`, `goal-card-list`).
* **Components:** Named exports. `PascalCase` for files and functions (e.g., `GoalCard.tsx`, `function GoalCard(...)`).
* **Types/Interfaces:** Primarily interfaces. `PascalCase` (e.g., `interface UserProfile { ... }`). In `types/` or co-located.
* **API Routes:** `app/api/goals/[goalId]/route.ts`.
* **Variables:** `camelCase` (e.g., `isLoading`, `targetDate`).

## 5. Key Considerations

* **Simplicity First:** Core loop: Log in -> Create Goal -> View Goals -> Interact.
* **Server Components:** Maximize RSC usage. `'use client'` for minimal, necessary client-side logic.
* **Data Fetching:** `react-query` for all server data operations.
* **Security:** Basic best practices (input sanitization, CSRF if applicable, auth checks).

## 6. Phase 5: Project Discovery & Advertising Platform

**Additional Features:**

13. **Project Management:**
    * **Prisma Schema:** `Project` model: `id`, `userId` (FK), `name`, `url`, `image` (optional), `description`, `coupons` (optional), `createdAt`, `updatedAt`.
    * **Goal-Project Relation:** Update `Goal` model with `projectId` (optional FK to `Project`).
    * **API Routes:**
        * `POST /api/projects`: Create new project (auth).
        * `GET /api/projects`: Get current user's projects (auth).
        * `GET /api/projects/public`: Get all public projects (paginated).
        * `GET /api/projects/[projectId]`: Get project details.
        * `PUT /api/projects/[projectId]`: Update project (auth, owner).
        * `DELETE /api/projects/[projectId]`: Delete project (auth, owner).
    * **UI:**
        * `project-form.tsx` (Shadcn: `Input`, `Textarea`, `FileUpload`, `Button`).
        * `project-card.tsx` for displaying projects with image, name, description, coupons.
        * Page (`/projects`) for project discovery.
        * Page (`/dashboard/projects`) for managing user's projects.

14. **Goal-Project Integration:**
    * **Enhanced Goal Form:** Add optional project selection dropdown.
    * **Goal Card Updates:** Display linked project info (name, image, URL) when available.
    * **Project Analytics:** Show linked goals count and status on project cards.

15. **Project Discovery:**
    * **Public Projects Page:** Browse all projects with filtering/sorting.
    * **Project Details Page:** Individual project pages with:
        * Project info and media
        * Linked goals (public ones)
        * User interaction (visit project, use coupons)
        * Project owner profile link
    * **Search & Filtering:** By category, status, recency, popularity.

16. **Monetization Features:**
    * **Coupon System:** Projects can offer discount codes/special offers.
    * **Traffic Analytics:** Track clicks to project URLs.
    * **Featured Projects:** Premium placement for paying users (future).
    * **Project Validation:** Badge system for verified/launched projects.

**Business Value:**

* **Traffic Generation:** Users discover and visit actual projects/products.
* **Lead Generation:** Projects capture interested users through goals.
* **Community Building:** Builders support each other's projects.
* **Revenue Potential:** Commission on sales, featured listings, premium features.

## 7. Phase 6: Twitter/X Authentication & Social Integration

**Primary Authentication System:**

17. **Twitter/X OAuth Implementation:**
    * **Replace Current Auth:** Make Twitter/X the primary and preferred authentication method.
    * **Better Auth Integration:** Update Better Auth configuration for Twitter/X OAuth.
    * **User Model Updates:**
        * Add `twitterHandle`, `twitterId`, `twitterAvatarUrl` to User schema.
        * Store Twitter profile data for enhanced user profiles.
        * Optional fallback to email/password for users without Twitter.
    * **UI Updates:**
        * Prominent "Continue with Twitter" button on login/signup.
        * Twitter branding and styling for auth components.
        * Quick Twitter profile access throughout the app.

18. **Enhanced User Profiles with Twitter Integration:**
    * **Profile Display:**
        * Show Twitter handle alongside username.
        * Link to Twitter profile with external link icon.
        * Use Twitter avatar as default profile image.
        * Display Twitter bio if available.
    * **Social Proof:**
        * Twitter follower count (if public API allows).
        * Verification status integration.
        * Link to Twitter profile from goal cards and project cards.

19. **Community Features:**
    * **Twitter-Style Interactions:**
        * Quick "Follow on Twitter" buttons on user profiles.
        * Tweet integration for goal achievements ("I just shipped my goal!").
        * Share goals and projects directly to Twitter.
    * **Discovery Enhancement:**
        * Find users by Twitter handle.
        * Import Twitter bio for project descriptions.
        * Suggest connections based on Twitter follows (if API permits).

20. **Indie Hacker Community Focus:**
    * **Specialized Features:**
        * Integration with #buildinpublic hashtag culture.
        * Tweet templates for goal updates and project launches.
        * Community hashtags for goal types (#30daygoal, #shipit, etc.).
    * **Social Validation:**
        * Display Twitter metrics where relevant.
        * Encourage cross-platform engagement.
        * Build reputation across both platforms.

**Technical Implementation:**

* **OAuth Flow:** Standard Twitter OAuth 2.0 with PKCE.
* **API Integration:** Twitter API v2 for profile data and optional posting.
* **Data Sync:** Periodic sync of Twitter profile updates.
* **Privacy Controls:** User control over what Twitter data is displayed.
* **Migration Path:** Smooth transition for existing email/password users.

**Community Benefits:**

* **Frictionless Onboarding:** Single-click signup for Twitter users.
* **Social Discovery:** Find and connect with fellow indie hackers.
* **Cross-Platform Growth:** Leverage existing Twitter networks.
* **Authentic Profiles:** Real Twitter identities reduce fake accounts.
* **Viral Potential:** Easy sharing increases platform visibility.
