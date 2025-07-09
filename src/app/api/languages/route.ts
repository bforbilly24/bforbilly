import { NextRequest } from 'next/server';
import { getWakaStatusBar, getWakaStats } from '@/lib/wakatime/actions';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const range = searchParams.get('range') || 'last_7_days';

	try {
		let languages = [];
		let rawResponse;

		if (range === 'today') {
			rawResponse = await getWakaStatusBar();

			languages = Array.isArray(rawResponse?.data?.languages) ? rawResponse.data.languages : [];
		} else {
			rawResponse = await getWakaStats(range as any);

			languages = Array.isArray(rawResponse?.data?.languages) ? rawResponse.data.languages : [];
		}

		return Response.json({
			success: true,
			data: languages,
			count: languages.length,
			debug: {
				range,
				rawResponseKeys: rawResponse ? Object.keys(rawResponse) : [],
				dataKeys: rawResponse?.data ? Object.keys(rawResponse.data) : [],
			},
		});
	} catch (error) {
		console.error('=== ERROR in API Route ===');
		console.error('Error details:', error);

		return Response.json(
			{
				success: false,
				data: [],
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	} finally {
	}
}
