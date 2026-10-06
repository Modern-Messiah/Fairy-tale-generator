import { getEnv } from "@/server/env";

export const dynamic = "force-dynamic";

export function GET() {
  const env = getEnv();
  return Response.json({
    status: "healthy",
    modelConfigured: env.XAI_API_KEY.length > 0,
  });
}
