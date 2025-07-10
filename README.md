# Digital Family Album

A modern web application for preserving your family's cultural and historical heritage. Collect, organize, and share photos, stories, and traditions in a secure digital album for future generations.

---

## Features

- **User Authentication**: Secure email + password login and registration (NextAuth.js)
- **Personal Albums**: Each user can create, edit, and delete their own photo albums
- **Photo Uploads**: Upload JPG/PNG images (up to 5MB), stored securely in the database
- **Gallery View**: Browse albums and photos in a beautiful, responsive gallery
- **Photo Modal**: View photos in a modal with next/prev navigation
- **Photo Management**: Delete photos, edit album details, and organize your collection
- **Cultural Heritage Focus**: Designed for families to preserve and celebrate their unique stories and traditions
- **Accessible & Responsive**: Works great on desktop and mobile

---

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, Server Components)
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) for database access
- [PostgreSQL](https://www.postgresql.org/) (Neon or local)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/OstafiichukO/da-project.git
cd da-project
```

### 2. Install Dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root with the following:

```
POSTGRES_URL=postgres://<user>:<password>@<host>:<port>/<db>
AUTH_SECRET=your-random-secret
```

- Generate a strong `AUTH_SECRET` [here](https://generate-secret.vercel.app/).

### 4. Set Up the Database

- Update `POSTGRES_URL` for your local or hosted Postgres instance.
- Run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Start the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Usage

- **Register** for an account and log in
- **Create albums** to organize your family’s photos
- **Upload photos** (JPG/PNG, max 5MB each)
- **View, flip through, and delete photos** in a modern gallery
- **Edit album details** or delete albums as needed

---

## Project Structure

- `app/` — Next.js app directory (pages, components, API routes)
- `app/gallery/` — Gallery and album management
- `app/api/` — API routes for albums, photos, upload, and auth
- `app/components/` — Reusable UI components
- `app/db.ts` — Database access and queries
- `app/schema.ts` — Drizzle ORM schema definitions
- `drizzle/` — Database migrations
- `public/assets/` — Static images (backgrounds, etc.)

---

## Deployment

Deploy to [Vercel](https://vercel.com/) or your preferred platform. Set the required environment variables in your deployment dashboard.

---

## Contributing

Contributions are welcome! Please open an issue or pull request for bug fixes, features, or improvements.

---

## License

MIT
