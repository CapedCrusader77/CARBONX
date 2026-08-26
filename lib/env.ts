import "server-only";

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().default("postgresql://postgres.adkfzhmjblrivukuhlvp:Nikhilvikram09@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?connect_timeout=2&pool_timeout=2"),
  NEXTAUTH_SECRET: z.string().min(32).default("replace-with-at-least-32-characters-long-secret"),
  NASA_FIRMS_MAP_KEY: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{32}$/, "must be a 32-character NASA FIRMS MAP_KEY")
    .default("ebdfaf1cdf01ef4852ad64e6649f7b01"),
  BLOCKCHAIN_CONTRACT_ADDRESS: z
    .string()
    .regex(/^0x[0-9a-fA-F]{40}$/, "must be a valid EVM contract address")
    .default("0x0000000000000000000000000000000000000000"),
  // Dev-only: guards the /api/admin/refresh endpoint.
  // Must never use NEXT_PUBLIC_ prefix.
  ADMIN_REFRESH_TOKEN: z.string().min(8).default("carbonx-dev-refresh"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = parsedEnv.data;
