-- Migration: Persist Manna chat history per user

CREATE TABLE public.chat_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'summary')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookup by user ordered by time
CREATE INDEX idx_chat_messages_user_created
  ON public.chat_messages(user_id, created_at ASC);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users read their own messages
CREATE POLICY "chat_messages_select_own"
  ON public.chat_messages FOR SELECT
  USING (user_id = auth.uid());

-- Users insert their own messages
CREATE POLICY "chat_messages_insert_own"
  ON public.chat_messages FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users delete their own messages (for clear history)
CREATE POLICY "chat_messages_delete_own"
  ON public.chat_messages FOR DELETE
  USING (user_id = auth.uid());
