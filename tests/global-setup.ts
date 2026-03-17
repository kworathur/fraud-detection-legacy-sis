import { getM2MAccessToken, apiRequest } from "./api-helpers";
import { TEST_USERS } from "./test-users";

interface BulkCreateResponse {
  message: string;
  created: string[];
  failed: Array<{ username: string; error: string }>;
}

export default async function globalSetup() {
  console.log("[global-setup] Obtaining M2M access token...");
  const token = await getM2MAccessToken();

  console.log(
    `[global-setup] Creating ${TEST_USERS.length} test users via bulk API...`,
  );
  const result = await apiRequest<BulkCreateResponse>(
    "testing/users/bulk",
    token,
    {
      method: "POST",
      body: JSON.stringify({ users: TEST_USERS }),
    },
  );

  console.log(`[global-setup] Created: ${result.created.length} users`);
  if (result.failed.length > 0) {
    for (const f of result.failed) {
      console.warn(`[global-setup]   Failed: ${f.username} — ${f.error}`);
    }
  }
}
