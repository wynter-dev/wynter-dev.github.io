import {NextResponse} from 'next/server';
import {BetaAnalyticsDataClient} from '@google-analytics/data';

const analytics = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
});

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID!;

export async function GET() {
  try {
    // 오늘 방문자
    const [todayRes] = await analytics.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{startDate: 'today', endDate: 'today'}],
      metrics: [{name: 'totalUsers'}],
    });

    const today = Number(todayRes.rows?.[0]?.metricValues?.[0]?.value ?? 0);

    // 전체 방문자 (GA4는 생성 이후 전체 기간)
    const [allRes] = await analytics.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{startDate: '2025-11-27', endDate: 'today'}],
      metrics: [{name: 'totalUsers'}],
    });

    const total = Number(allRes.rows?.[0]?.metricValues?.[0]?.value ?? 0);

    return NextResponse.json({today, total});
  } catch (err) {
    console.error('[Analytics Visitors Error]', err);
    return NextResponse.json({today: 0, total: 0}, {status: 500});
  }
}
