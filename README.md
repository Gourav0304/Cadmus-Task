# 📝 Cadmus Collaborative Editing Environment

This is a **full-stack collaborative text editing application** built as part of the Cadmus Software Engineer **Homework Task**.

It features a **React + TypeScript** frontend powered by **TipTap (ProseMirror)** for rich-text editing and collaboration, and a **Node.js + Express + Prisma** backend connected to a **PostgreSQL** database.

The application demonstrates **real-time collaborative editing** using ProseMirror’s official collaboration plugin, providing a multi-user editing experience with conflict resolution, live synchronization, and persistent storage.

---

## 🖥️ Tech Stack

**Frontend (client):**

- ⚛️ React + TypeScript
- 🎨 Tailwind CSS
- 🧠 TipTap Editor
- 🤝 ProseMirror Collaboration Stack
- 💅 Lucide React Icons
- 🧰 ESLint + Prettier
- 🧱 Vite Plugin React

**Backend (api):**

- 🟩 Node.js
- 🚏 Express.js
- 📘 TypeScript
- 🗂️ Prisma ORM
- 🐘 PostgreSQL
- 🔁 Nodemon
- 🧱 ts-node

**Dev Tools:**

- 📦 pnpm
- 🐳 Docker + docker-compose
- ✨ ESLint + Prettier
- ⚡ Vite

---

## 🌐 Features

- ⚡ **Real‑time editing**: Instant updates with debounce handling for smooth typing and consistent state.
- 🧰 **Rich toolbar**: Bold, italic, lists, links, undo/redo, and formatting shortcuts for faster authoring.
- 🔍 **Multi‑filter view**: Content filters to refine what’s visible while writing and reviewing text.​
- 🧮 **Live word count**: Dynamic words/characters counter that updates as you type for precise limits.
- ♻️ **Reset document**: One‑click button to clear the editor and start fresh without manual deletion.
- ♿ **Accessibility‑friendly**: Keyboard navigation and Markdown syntax support for inclusive editing workflows.

---

## 📁 Project Structure

```
cadmus-prosemirror-task/
├─ client/
│  ├─ .github/
│  ├─ .husky/
│  ├─ .vscode/
│  ├─ node_modules/
│  ├─ public/
│  ├─ src/
│  ├─ .gitignore
│  ├─ .prettierignore
│  ├─ .prettierrc
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  ├─ vite.config.ts
├─ node_modules/
├─ server/
│  ├─ logs/
│  ├─ node_modules/
│  ├─ prisma/
│  ├─ src/
│  ├─ .env
│  ├─ .gitignore
│  ├─ .prettierignore
│  ├─ .prettierrc
│  ├─ eslint.config.js
│  ├─ nodemon.json
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ tsconfig.json
├─ .gitignore
├─ docker-compose.yml
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md

```

---

🧪 Development Environment Used

| Tool    | Version      |
| ------- | ------------ |
| Node.js | v20.19.0     |
| PNPM    | v10.14.0     |
| Docker  | v28.1.1      |
| OS      | Ubuntu 23.04 |

---

## ⚙️ Environment Variables

Create a `.env` file inside both **server/** and **client/**:

**🎨 client/.env**

```env
# 🌍 API Endpoint
VITE_API_BASE_URL=http://localhost:4000
VITE_COLLAB_BASE=/collab
```

**📡 server/.env**

```env
# 🚀 Server Config
PORT=4000

# 🐘 PostgreSQL Config
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# 🔗 Prisma Connection URL
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

DATABASE_URL="postgresql://collab:collabpass@localhost:5438/collabdb?schema=public"
```

---

## 🚀 Running the App [All commands to be executed on root folder]

### 1 Run with Docker

```bash
docker compose up
```

### 2 Install dependencies

This step will install the dependencies on both api and client folders

At the root of the project:

```bash
pnpm install
pnpm run build:prisma
```

### 3 Run manually with pnpm workspaces

We will start the backend and frontend in this step individually

Start backend:

```bash
pnpm --filter api dev
```

Start frontend:

```bash
pnpm --filter client dev
```

App will be running at:  
👉 Frontend: `http://localhost:3000`  
👉 Backend: `http://localhost:5000`

---

🧪 Running Tests

This project uses Jest with support for both frontend (client) and backend (api) tests.
Tests can be run individually or all at once from the monorepo root.

Run frontend (client) tests only

```bash
pnpm run test:client
```

Run backend (api) tests only

```bash
pnpm run test:api
```

---

## 📝 Developer Notes

## Architecture Decisions and Salient features

- The structure is a monorepo with pnpm workspaces

- Maintains a clear separation of concerns between frontend (React) and backend (Express).

## App snapshots

![Dashboard preview](/assets/app-dashboard.png)

## Working APP demo

![Dashboard demo](/assets/app-dashboard.gif)
