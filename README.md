# Podcastr

## 🚀 Introduction

Podcastr-sm is a **cutting-edge podcast platform** that eliminates the need for a real human voice by leveraging AI-powered features. The project was initially based on a **JavaScript Mastery YouTube tutorial**, but I **significantly expanded and customized it** to create a fully functional and professional application.

Key highlights:

* AI **text-to-multiple-voices conversion** and **AI-generated images** for podcast thumbnails
* **Secure authentication** with Clerk
* Modern homepage featuring **trending podcasts** and a **sticky podcast player** for continuous listening
* Dedicated search, discovery, and **profile pages** for content management
* Fully responsive, mobile-friendly UI with **TailwindCSS** and advanced **React state management**

<img width="765" height="603" alt="podcastr" src="https://github.com/user-attachments/assets/71bad544-d666-43cc-8121-2a453b44396e" />

---

## 🧩 Features

### 🎧 Audio & Podcast Player

* Manual **close player** function with proper state resets
* **Current time / total duration** display
* **Mute state synchronization** between plays
* Conditional rendering for `<audio>` and `<Image>` elements to prevent errors

### 📊 User Interaction & Analytics

* **User-triggered view counting** for podcasts
* Interactive and user-friendly **delete menu with click-outside-to-close behavior**
* **Deletion confirmation dialog** to prevent accidental data loss

### 🛠️ Podcast & Episode Management

* **Create, edit, and delete podcasts** with AI audio and image integration
* Fully-featured **EditPodcastModal** with real-time AI voice preview
* **Episode management system**: create, edit, preview, and play episodes
* **EpisodeDetailsClient** for individual episode pages with metadata, transcriptions, and recommendations
* **Separate loading states** for actions like generating audio vs submitting edits

### 🌐 Navigation & Authentication

* Public access to `/podcasts` and `/discover` routes
* Middleware configured to **handle authentication and public routes correctly**
* Profile page displaying all user-created podcasts

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, TailwindCSS, ShadCN/UI, Radix UI, Embla Carousel
* **Backend:** Convex (database & storage)
* **Authentication:** Clerk
* **AI Features:** OpenAI (text-to-speech & image generation)
* **Form & Validation:** React Hook Form, Zod, TypeScript
* **Utilities:** clsx, tailwind-merge, sonner notifications

---

## ⚡ Installation

1. Clone the repository:

```bash
git clone https://github.com/SALVADORPOETA/Podcastr-sm.git
cd Podcastr-sm
```

2. Install dependencies:

```bash
npm install
```

3. Add environment variables:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
OPEN_API_KEY=your_openai_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🎨 Usage

* Sign in via email or Google
* **Browse trending podcasts** or search by title, description, or author
* **Play podcasts** with a sticky, controllable audio player
* **Create new podcasts** with AI-generated audio and thumbnail previews
* **Edit existing podcasts** or episodes via the update modal
* **View episode details** including descriptions, AI-generated transcription, and related podcasts
* **Manage content safely** with deletion confirmation dialogs and external click-to-close menus

---

## 📦 Project Structure

```
podcastr-sm/
├─ app/                 # Next.js app routes and pages
├─ components/          # Reusable UI components (Navbar, Player, Modals)
├─ context/             # React contexts (AudioProvider)
├─ convex/              # Convex backend: schema, queries, mutations
├─ lib/                 # Utilities: debounce, formatTime, className helpers
├─ public/              # Static assets: images, icons
├─ styles/              # Global TailwindCSS styles
├─ package.json
└─ tsconfig.json
```

---

## 🔧 Key Contributions & Improvements

1. Manual player close function with proper state reset
2. Enhanced player UI with current/total time display
3. Synchronized mute state across podcast plays
4. User-interaction-based view counting from scratch
5. Configured middleware for public routes (`/podcasts`, `/discover`)
6. Fixed `<audio>` and `<Image>` src attribute errors
7. Implemented external click-to-close functionality for delete menus
8. Added deletion confirmation dialogs for safe content management
9. Differentiated loading states for actions to improve user feedback
10. Refactored CSS for consistent styling and improved UX
11. Complete podcast editing workflow with update modal
12. Real-time AI voice preview integration
13. Developed episode detail page with data fetching and player integration
14. Refactored and debugged audio player for state consistency
15. Full episode management system: CRUD, playback, AI generation, editing, and deletion

---

## 🌐 Links

* GitHub: [https://github.com/SALVADORPOETA/Podcastr-sm](https://github.com/SALVADORPOETA/Podcastr-sm)
* LinkedIn: [https://www.linkedin.com/in/salvador-martinez-sm/](https://www.linkedin.com/in/salvador-martinez-sm/)

---

## ⚖️ License

This is a personal portfolio project by **Salvador Martínez**. No commercial use intended.

---
