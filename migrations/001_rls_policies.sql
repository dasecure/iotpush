-- Enable RLS on all iotpush tables
-- Run this in Supabase SQL Editor

-- Enable RLS
ALTER TABLE iot_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own topics" ON iot_topics;
DROP POLICY IF EXISTS "Users can create own topics" ON iot_topics;
DROP POLICY IF EXISTS "Users can update own topics" ON iot_topics;
DROP POLICY IF EXISTS "Users can delete own topics" ON iot_topics;

DROP POLICY IF EXISTS "Users can view messages in own topics" ON iot_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON iot_messages;

DROP POLICY IF EXISTS "Users can view own account" ON iot_accounts;
DROP POLICY IF EXISTS "Users can update own account" ON iot_accounts;

DROP POLICY IF EXISTS "Users can view own subscribers" ON iot_subscribers;
DROP POLICY IF EXISTS "Users can manage own subscribers" ON iot_subscribers;

-- iot_topics policies
CREATE POLICY "Users can view own topics" ON iot_topics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own topics" ON iot_topics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topics" ON iot_topics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own topics" ON iot_topics
  FOR DELETE USING (auth.uid() = user_id);

-- iot_messages policies
-- Users can view messages in their own topics
CREATE POLICY "Users can view messages in own topics" ON iot_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM iot_topics 
      WHERE iot_topics.id = iot_messages.topic_id 
      AND iot_topics.user_id = auth.uid()
    )
  );

-- Anyone with API key can insert messages (handled by API route, not RLS)
-- Service role bypasses RLS, so API routes using service key can insert
CREATE POLICY "Anyone can insert messages" ON iot_messages
  FOR INSERT WITH CHECK (true);

-- iot_accounts policies
CREATE POLICY "Users can view own account" ON iot_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own account" ON iot_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own account" ON iot_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- iot_subscribers policies
CREATE POLICY "Users can view own subscribers" ON iot_subscribers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscribers" ON iot_subscribers
  FOR ALL USING (auth.uid() = user_id);
