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

  const [report] = await client.runReport({
    property,
    dimensions: [{ name: "date" }],
    metrics: [{ name: "activeUsers" }],
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
  });

  return NextResponse.json(report.rows || []);
}
