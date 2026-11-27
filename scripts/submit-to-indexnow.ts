/**
 * Submit all main pages to Bing IndexNow
 * Run with: npx ts-node scripts/submit-to-indexnow.ts
 * Or compile and run: node scripts/submit-to-indexnow.js
 */

const SITE_URL = 'https://cafehakerem.co.il';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const INDEXNOW_HOST = 'cafehakerem.co.il';
const INDEXNOW_KEY = '926121c6bafe48e1a3377aab87f4421b';
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// All public pages to submit
const PAGES = [
  '',
  'menu',
  'about',
  'jachnun',
  'catering',
  'contact',
  'map',
  'coffee-club',
  'offers',
  'hanukkah',
  'accessibility',
  'privacy',
];

async function submitToIndexNow() {
  const urlList = PAGES.map(page =>
    page ? `${SITE_URL}/${page}` : SITE_URL
  );

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  console.log('📡 Submitting to Bing IndexNow...\n');
  console.log(`Host: ${INDEXNOW_HOST}`);
  console.log(`URLs: ${urlList.length}`);
  console.log(`Endpoint: ${INDEXNOW_ENDPOINT}\n`);

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const statusCode = response.status;
    console.log(`Response Status: ${statusCode}\n`);

    if (statusCode === 200) {
      console.log('✅ Success! All URLs submitted to Bing IndexNow');
      console.log('\nURLs submitted:');
      urlList.forEach(url => console.log(`  • ${url}`));
    } else if (statusCode === 403) {
      console.log('❌ Error: Verification failed');
      console.log('   - Key file not found at', INDEXNOW_KEY_LOCATION);
      console.log('   - Or key mismatch in file');
    } else if (statusCode === 400) {
      console.log('❌ Error: Bad request (invalid format)');
      console.log(await response.text());
    } else if (statusCode === 429) {
      console.log('⚠️  Rate limited - try again in a few minutes');
    } else if (statusCode === 422) {
      console.log('❌ Error: URLs or key mismatch with schema');
      console.log(await response.text());
    } else {
      console.log(`❌ Unexpected status: ${statusCode}`);
      console.log(await response.text());
    }
  } catch (error) {
    console.error('❌ Failed to submit to IndexNow:', error);
    process.exit(1);
  }
}

submitToIndexNow();
