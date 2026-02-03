# Deployment Guide - Momentum League Cornubia

## Project Architecture
This project consists of two separate React applications sharing a single Supabase backend:
1. **Public Site** (Root directory): For players and fans.
2. **Admin Dashboard** (`/admin-app`): For league management.

---

## 1. Supabase Setup

### Database Schema
1. Go to [supabase.com](https://supabase.com) -> SQL Editor.
2. Run the updated `supabase/schema.sql`. This creates all tables, views, and the `matchday` column.

### Environment Variables
Create a `.env` file in the **root** folder (both apps share this):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Admin User
1. Create a user in Supabase Authentication.
2. Copy their UUID and add it to the `admins` table:
```sql
INSERT INTO admins (user_id, email) VALUES ('USER_UUID', 'admin@example.com');
```

---

## 2. Deploying Public Site (Root)

Run these commands in the root directory:
```bash
npm install
npm run build
```
Deploy the `dist` folder to Netlify/Vercel.

---

## 3. Deploying Admin Dashboard (`/admin-app`)

Run these commands in the `admin-app` directory:
```bash
cd admin-app
npm install
npm run build
```
Deploy the `admin-app/dist` folder to a separate site (recommended) or a subdomain.

---

## 4. Key Features
- **Auto Fixtures**: Go to Admin Dashboard -> Fixtures -> Generate. (Requires 6 teams).
- **Player Rosters**: Edit players in Admin Dashboard -> Teams.
- **Results**: Enter final scores in Admin Dashboard -> Matches.
