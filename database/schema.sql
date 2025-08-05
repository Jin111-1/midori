-- Midori Database Schema
-- This schema implements the ERD design from the README

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by Supabase Auth)
-- This table is automatically created by Supabase
-- but we can add custom columns if needed
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_public BOOLEAN DEFAULT FALSE
);

-- Versions table (for version control)
CREATE TABLE versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    version_number INTEGER NOT NULL DEFAULT 1,
    commit_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompts table (for prompt caching and history)
CREATE TABLE prompts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    prompt_text TEXT NOT NULL,
    cached_summary TEXT,
    refined_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Token usage tracking
CREATE TABLE token_usages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    model_used VARCHAR(100) NOT NULL,
    token_count INTEGER NOT NULL,
    cost_usd DECIMAL(10, 6),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drafts table (for draft version system)
CREATE TABLE drafts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
    code TEXT NOT NULL,
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat history table (for conversation continuity)
CREATE TABLE chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'midori')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table (for future features)
CREATE TABLE user_preferences (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light',
    editor_settings JSONB DEFAULT '{}',
    ai_model_preference VARCHAR(50) DEFAULT 'gpt-4o',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_versions_project_id ON versions(project_id);
CREATE INDEX idx_prompts_project_id ON prompts(project_id);
CREATE INDEX idx_token_usages_user_id ON token_usages(user_id);
CREATE INDEX idx_drafts_project_id ON drafts(project_id);
CREATE INDEX idx_chat_history_project_id ON chat_history(project_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Projects
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Versions
CREATE POLICY "Users can view versions of their projects" ON versions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = versions.project_id
        )
    );

CREATE POLICY "Users can create versions for their projects" ON versions
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = versions.project_id
        )
    );

-- RLS Policies for Prompts
CREATE POLICY "Users can view prompts for their projects" ON prompts
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = prompts.project_id
        )
    );

CREATE POLICY "Users can create prompts for their projects" ON prompts
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = prompts.project_id
        )
    );

-- RLS Policies for Token Usages
CREATE POLICY "Users can view their own token usage" ON token_usages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own token usage records" ON token_usages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Drafts
CREATE POLICY "Users can view drafts for their projects" ON drafts
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = drafts.project_id
        )
    );

CREATE POLICY "Users can create drafts for their projects" ON drafts
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = drafts.project_id
        )
    );

CREATE POLICY "Users can update drafts for their projects" ON drafts
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = drafts.project_id
        )
    );

-- RLS Policies for Chat History
CREATE POLICY "Users can view chat history for their projects" ON chat_history
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = chat_history.project_id
        )
    );

CREATE POLICY "Users can create chat history for their projects" ON chat_history
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM projects WHERE id = chat_history.project_id
        )
    );

-- RLS Policies for User Preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at BEFORE UPDATE ON drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();