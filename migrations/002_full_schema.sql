-- iotpush Full Schema
-- Run this in the NEW Supabase SQL Editor (dhrcdbybknhxjtbjpoem)

-- iot_accounts: user billing/plan info
CREATE TABLE IF NOT EXISTS iot_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  pushes_used INTEGER DEFAULT 0,
  pushes_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- iot_topics: notification channels
CREATE TABLE IF NOT EXISTS iot_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  api_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- iot_messages: push messages sent to topics
CREATE TABLE IF NOT EXISTS iot_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES iot_topics(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  tags TEXT[],
  click_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- iot_subscribers: push token subscriptions
CREATE TABLE IF NOT EXISTS iot_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES iot_topics(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  type TEXT DEFAULT 'expo_push',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_topics_user ON iot_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_api_key ON iot_topics(api_key);
CREATE INDEX IF NOT EXISTS idx_messages_topic ON iot_messages(topic_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON iot_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_topic ON iot_subscribers(topic_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user ON iot_accounts(user_id);

-- Enable RLS
ALTER TABLE iot_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_subscribers ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners too
ALTER TABLE iot_topics FORCE ROW LEVEL SECURITY;
ALTER TABLE iot_messages FORCE ROW LEVEL SECURITY;
ALTER TABLE iot_accounts FORCE ROW LEVEL SECURITY;
ALTER TABLE iot_subscribers FORCE ROW LEVEL SECURITY;

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
CREATE POLICY "Users can view messages in own topics" ON iot_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM iot_topics 
      WHERE iot_topics.id = iot_messages.topic_id 
      AND iot_topics.user_id = auth.uid()
    )
  );

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
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM iot_topics 
      WHERE iot_topics.id = iot_subscribers.topic_id 
      AND iot_topics.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own subscribers" ON iot_subscribers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM iot_topics 
      WHERE iot_topics.id = iot_subscribers.topic_id 
      AND iot_topics.user_id = auth.uid()
    )
  );
