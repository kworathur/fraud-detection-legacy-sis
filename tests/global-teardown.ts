import { getM2MAccessToken, apiRequest } from "./api-helpers";
import { TEST_USERS } from "./test-users";

interface BulkDeleteResponse {
  message: string;
  deleted: string[];
  failed: Array<{ username: string; error: string }>;
}

export default async function globalTeardown() {
  const usernames = TEST_USERS.map((u) => u.username);

  console.log("[global-teardown] Obtaining M2M access token...");
  const token = await getM2MAccessToken();

  console.log(
    `[global-teardown] Deleting ${usernames.length} test users via bulk API...`,
  );
  const result = await apiRequest<BulkDeleteResponse>(
    "testing/users/bulk",
    token,
    {
      method: "DELETE",
      body: JSON.stringify({ usernames }),
    },
  );

  console.log(`[global-teardown] Deleted: ${result.deleted.length} users`);
  if (result.failed.length > 0) {
    for (const f of result.failed) {
      console.warn(`[global-teardown]   Failed: ${f.username} — ${f.error}`);
    }
  }
}
