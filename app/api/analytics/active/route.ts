import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export async function GET() {
  const property = `properties/${process.env.GA_PROPERTY_ID}`;

  // Real-time API
  const [response] = await client.runRealtimeReport({
    property,
    metrics: [{ name: "activeUsers" }],
  });

  const activeUsers30m = Number(response.rows?.[0]?.metricValues?.[0]?.value ?? 0);

  return NextResponse.json({ active30m: activeUsers30m });
}
