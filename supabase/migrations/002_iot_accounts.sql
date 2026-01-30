-- User accounts with plan/billing info
CREATE TABLE IF NOT EXISTS iot_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT,
  pushes_used INTEGER NOT NULL DEFAULT 0,
  pushes_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE iot_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own account"
  ON iot_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all accounts"
  ON iot_accounts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for Stripe customer lookup
CREATE INDEX IF NOT EXISTS idx_iot_accounts_stripe_customer_id
  ON iot_accounts(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Auto-create account on user signup
CREATE OR REPLACE FUNCTION create_iot_account()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO iot_accounts (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created_iot_account
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_iot_account();
