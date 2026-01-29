-- iotpush tables (prefixed with iot_ to avoid conflicts)

CREATE TABLE iot_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE TABLE iot_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES iot_topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  tags TEXT[],
  click_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE iot_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES iot_topics(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL, -- push subscription endpoint or webhook URL
  type TEXT DEFAULT 'web', -- web, webhook, email
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(topic_id, endpoint)
);

-- Indexes
CREATE INDEX idx_iot_topics_user ON iot_topics(user_id);
CREATE INDEX idx_iot_topics_name ON iot_topics(name);
CREATE INDEX idx_iot_messages_topic ON iot_messages(topic_id);
CREATE INDEX idx_iot_messages_created ON iot_messages(created_at);
CREATE INDEX idx_iot_subscribers_topic ON iot_subscribers(topic_id);

-- RLS
ALTER TABLE iot_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_subscribers ENABLE ROW LEVEL SECURITY;

-- Topics: owners can CRUD
CREATE POLICY "Users can manage own topics" ON iot_topics FOR ALL USING (auth.uid() = user_id);
-- Public can read non-private topics (for API push)
CREATE POLICY "Public can view public topics" ON iot_topics FOR SELECT USING (is_private = false);

-- Messages: owners can read, service role can insert
CREATE POLICY "Owners can view messages" ON iot_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM iot_topics WHERE iot_topics.id = iot_messages.topic_id AND iot_topics.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert messages" ON iot_messages FOR INSERT WITH CHECK (true);

-- Subscribers: owners can manage
CREATE POLICY "Owners can manage subscribers" ON iot_subscribers FOR ALL USING (
  EXISTS (SELECT 1 FROM iot_topics WHERE iot_topics.id = iot_subscribers.topic_id AND iot_topics.user_id = auth.uid())
);
