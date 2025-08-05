#  Midori – Prompt-based Website Generator

**Midori** is an intelligent AI assistant that helps users generate websites from natural language prompts. Inspired by lovable.dev, it features an AI character named Midori who guides users through the creative process, offering a smooth and delightful experience.

---

## ✅ Core Features

### 1. 🧠 AI Character: Midori

- Acts as a friendly AI companion.
- Helps interpret and refine user prompts.
- Ensures cleaner and more concise requirements before code generation.

### 2. 💬 Two-Step Prompt Flow

- **Step 1**: User enters an idea → Midori summarizes and clarifies.
- **Step 2**: Midori submits refined request to the AI model → generates code.

### 3. 🧑‍💻 Code Editor + Live Preview

- Uses **Monaco Editor** with real-time preview.
- Features inline conversations with Midori.
- Highlights modified code and provides draft previews.

### 4. 📝 Draft Version System

- Every code response is stored as a draft in localStorage.
- Requires explicit Save to be persisted to the database.
- Drafts are linked to the prompt that generated them.

### 5. 🧾 Prompt Cache System

- Each prompt entered by the user is saved as a cache.
- Enables context-aware follow-ups and editing from previous prompts.
- Cached prompts are used during summarize/edit stages for faster UX.
- Prompt cache is separate from chat history but optimized for AI reusability.

### 6. 💬 Chat History (for UX)

- Midori stores previous chats in a separate history log.
- Useful for navigating past ideas or reviewing the conversation flow.
- Chat history improves the overall user experience and continuity.

### 7. 🧷 Code Safety

- Sanity checks for dangerous HTML/JS before rendering preview.

### 8. 📦 Version Control

- Each project maintains version history.
- Users can revert or compare old versions.

### 9. 🔐 Authentication

- Basic Supabase Auth (email/password).
- For demo purpose only.
- Tiered user roles (Free/Pro/Admin) planned for future.

### 10. 🌐 Token Management System

- Tracks total token usage per user and per project.
- Routes requests to the most efficient model (OpenAI, DeepSeek, etc.).

### 11. 📁 Future Feature: GitHub Integration

- Users will be able to export project as GitHub repo.

---

## 🧱 Tech Stack

| Layer       | Tech                   |
| ----------- | ---------------------- |
| Frontend    | Next.js + Tailwind CSS |
| Editor      | Monaco Editor          |
| Backend/API | Next.js (API Routes)   |
| AI Services | OpenAI, DeepSeek (API) |
| Database    | Supabase (Postgres)    |
| Deploy      | Vercel                 |

---

## 📁 Folder Structure

```
/app
  /projects
  /auth
  /editor
  /api
    /ai
    /projects
    /auth
/components
/lib
/utils
/types
/styles
```

---

## 🗃️ ERD (Entity Relationship Diagram)

- **users**: id, email
- **projects**: id, user\_id, name, created\_at
- **versions**: id, project\_id, code, created\_at
- **prompts**: id, project\_id, prompt\_text, created\_at, cached\_summary
- **token\_usages**: id, user\_id, model\_used, token\_count, created\_at
- **drafts**: id, project\_id, prompt\_id, code, is\_saved, created\_at
- **chat\_history**: id, project\_id, role, content, created\_at

---

## 🚀 MVP Goal (Phase 1)

- Prompt → AI summarizes → generates code → live preview.
- Draft stored locally until saved.
- Authentication and version history optional at first.
- Prompt caching and draft linkage enabled.
- Summary responses can use prompt cache for UX.

---

## 📌 Deployment

- **Frontend/Backend**: Hosted on **Vercel**
- **Database/Auth**: Supabase
- **Models**: Routed to OpenAI/DeepSeek as needed

---

## 🔮 Future Enhancements

- GitHub repo export
- Team collaboration
- Prompt templates
- Tiered token quota
- Version comparison UI
