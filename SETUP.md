# Midori Setup Guide

## Quick Start

The Midori project has been successfully initialized with all core features implemented. Here's how to get it running:

### 1. Install Dependencies
Dependencies are already installed, but if needed:
```bash
npm install
```

### 2. Environment Setup
1. Copy the environment template:
```bash
cp .env.local.example .env.local
```

2. Configure your environment variables in `.env.local`:
```env
# Required for AI functionality
OPENAI_API_KEY=your_openai_api_key_here

# Optional - For future Supabase integration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Current Features ✅

### Core MVP Features (Completed)
- ✅ **Midori AI Character**: Friendly chat interface for prompt refinement
- ✅ **Two-Step Prompt Flow**: User prompt → Midori summary → Code generation
- ✅ **Monaco Editor**: Professional code editor with syntax highlighting
- ✅ **Live Preview**: Real-time website preview in iframe
- ✅ **Draft System**: Local storage for unsaved drafts
- ✅ **Project Management**: Basic project listing and navigation
- ✅ **Responsive Design**: Mobile-friendly interface

### Technical Implementation
- ✅ **Next.js 14**: App router with TypeScript
- ✅ **Tailwind CSS**: Modern styling system
- ✅ **OpenAI Integration**: GPT-4 for code generation, GPT-4o-mini for chat
- ✅ **Monaco Editor**: VS Code-like editing experience
- ✅ **Component Architecture**: Modular, reusable components

## How to Use Midori

### 1. Start a Conversation
- Open the application at `http://localhost:3000`
- Midori will greet you in the chat interface
- Describe your website idea in natural language

### 2. Refine Your Idea
- Midori will summarize your request
- Ask clarifying questions if needed
- Continue the conversation to refine your requirements

### 3. Generate Code
- Click "✨ Generate Website Code" when ready
- Midori will create HTML/CSS/JavaScript code
- View the live preview instantly

### 4. Edit and Save
- Modify the code in the Monaco editor
- Changes appear in live preview immediately
- Drafts are auto-saved locally
- Click "Save" to persist your work

## Architecture Overview

```
src/
├── app/
│   ├── page.tsx                 # Landing page with Midori chat
│   ├── editor/
│   │   └── page.tsx            # Code editor with live preview
│   └── api/
│       └── ai/
│           ├── midori/route.ts  # Midori chat API
│           └── generate/route.ts # Code generation API
├── components/
│   ├── MidoriChat.tsx          # Main chat interface
│   ├── ProjectList.tsx         # Project sidebar
│   └── CodeEditor.tsx          # Monaco editor + preview
├── lib/
│   ├── openai.ts              # OpenAI client configuration
│   └── supabase.ts            # Supabase client (for future use)
└── types/
    └── index.ts               # TypeScript definitions
```

## Development Status

### Completed (Phase 1 MVP)
- Basic prompt-to-code workflow
- Midori AI character implementation
- Code editor with live preview
- Draft system with localStorage
- Responsive UI design

### Next Phase (Phase 2)
- Supabase authentication
- Database integration
- Advanced prompt caching
- Version history
- GitHub export functionality

## Testing the Application

### Test Scenarios
1. **Basic Flow**:
   - Describe a simple website (e.g., "Create a portfolio page")
   - Verify Midori responds appropriately
   - Generate code and check live preview

2. **Editor Features**:
   - Test code editing in Monaco
   - Verify live preview updates
   - Test save/download functionality

3. **Draft System**:
   - Make code changes
   - Verify drafts are saved locally
   - Test save functionality

### Example Prompts to Try
- "Create a modern landing page for a coffee shop"
- "Build a personal portfolio website with a dark theme"
- "Make a simple blog layout with a header and sidebar"
- "Design a pricing page for a SaaS product"

## Troubleshooting

### Common Issues
1. **OpenAI API Errors**: Ensure `OPENAI_API_KEY` is set correctly
2. **Monaco Editor Loading**: Check browser console for errors
3. **Preview Not Updating**: Verify iframe security settings

### Browser Requirements
- Modern browsers supporting ES6+
- JavaScript enabled
- iframe support for live preview

## Future Enhancements

### Planned Features
- User authentication with Supabase
- Cloud storage for projects
- Advanced AI models integration
- Team collaboration features
- Template gallery
- GitHub repository export

The Midori project is now ready for development and testing! 🎉