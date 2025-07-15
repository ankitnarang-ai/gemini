# Gemini Chat Clone - React App

A full-featured, modern Gemini-style chat interface built with React + Vite + Tailwind CSS. It supports real-time typing simulation, image uploads, reverse infinite scroll, chatroom management, OTP-based authentication, and toast notifications.

## Setup & Run Instructions

- Clone the repository: `git clone https://github.com/ankitnarang-ai/gemini.git`
- Navigate to directory: `cd gemini-chat-clone`
- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Build for production: `npm run build`

## Authentication (OTP Flow)

- Login/signup with phone number and country code
- OTP is simulated using setTimeout
- Auth status is stored in localStorage
- ChatPage is protected by auth state

## Core Features & Implementation

### Typing Indicator (Throttled)
- Gemini replies are delayed with setTimeout
- Simulates real-time assistant typing

### Reverse Infinite Scroll
- Latest messages are at the bottom
- Older messages load as user scrolls up
- Pagination is handled with PAGE_SIZE per chat

### Pagination
- Messages per chatroom are paginated
- Tracks page and hasMore for each chat
- Local data is sliced efficiently

### Form Validation
- Using React Hook Form + Zod
- Validates country code and phone format
- OTP format validation (numeric, 6-digit)
- Send button disabled if form is invalid

## Additional Features

- Dark mode toggle
- Debounced search for chat titles
- Copy-to-clipboard on hover
- Image upload in messages
- Toast notifications (shared component)
- Simulated Gemini AI responses
- Create, rename, delete chatrooms
- Auth-protected routing
- Fully responsive and mobile-friendly

## Toast Notifications

Examples using `showToast(message, type)`:
- `showToast("OTP sent!", "success");`
- `showToast("OTP verified successfully", "success");`
- `showToast("Chat deleted", "info");`

Available types: success, error, info

## Technology Stack

- React 18
- Vite
- Tailwind CSS
- React Hook Form
- Zod validation
- Responsive design
