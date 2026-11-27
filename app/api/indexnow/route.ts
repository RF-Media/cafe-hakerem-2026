import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_HOST = 'cafehakerem.co.il';
const INDEXNOW_KEY = '926121c6bafe48e1a3377aab87f4421b';
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urlList } = body;

    if (!urlList || !Array.isArray(urlList) || urlList.length === 0) {
      return NextResponse.json(
        { error: 'urlList is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // Prepare the payload
    const payload = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urlList,
    };

    // Submit to Bing IndexNow
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const statusCode = response.status;
    let result: Record<string, unknown> = { status: statusCode };

    // Map response codes
    if (statusCode === 200) {
      result.message = 'URLs submitted successfully';
    } else if (statusCode === 400) {
      result.message = 'Bad request - invalid format';
    } else if (statusCode === 403) {
      result.message = 'Forbidden - key not valid or file not found';
    } else if (statusCode === 422) {
      result.message = 'Unprocessable Entity - URLs don\'t belong to the host or key mismatch';
    } else if (statusCode === 429) {
      result.message = 'Too many requests - potential spam rate limit hit';
    }

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('IndexNow submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit to IndexNow' },
      { status: 500 }
    );
  }
}
