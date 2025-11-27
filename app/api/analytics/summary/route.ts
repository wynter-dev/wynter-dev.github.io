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

  const [today] = await client.runReport({
    property,
    dateRanges: [{ startDate: "today", endDate: "today" }],
    metrics: [{ name: "activeUsers" }],
  });

  const [yesterday] = await client.runReport({
    property,
    dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
    metrics: [{ name: "activeUsers" }],
  });

  const todayUsers = Number(today.rows?.[0]?.metricValues?.[0]?.value ?? 0);
  const yestUsers = Number(yesterday.rows?.[0]?.metricValues?.[0]?.value ?? 0);

  return NextResponse.json({
    today: todayUsers,
    yesterday: yestUsers,
    diff: todayUsers - yestUsers,
  });
}
