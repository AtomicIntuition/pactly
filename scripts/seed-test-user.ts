import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const testEmail = process.env.TEST_USER_EMAIL || "test@proposalai.dev";
const testPassword = process.env.TEST_USER_PASSWORD || "TestPass123!";

async function seed(): Promise<void> {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === testEmail);

  if (existing) {
    console.log(`Test user already exists: ${testEmail}`);
    return;
  }

  // Create the test user (the handle_new_user trigger will create the profile)
  const { data, error } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { full_name: "Test User" },
  });

  if (error) {
    console.error("Failed to create test user:", error.message);
    process.exit(1);
  }

  console.log(`Test user created: ${data.user.email} (${data.user.id})`);
  console.log(`Login with: ${testEmail} / ${testPassword}`);
}

seed();
