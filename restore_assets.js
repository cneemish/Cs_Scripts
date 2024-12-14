const fetch = require('node-fetch');

const API_KEY = '<stack_api_key>';
const AUTH_TOKEN = '<restorers_auth_token>';
const BIN_API_URL = 'https://app.contentstack.com/api/v3/bin/assets';
const RESTORE_API_URL = 'https://app.contentstack.com/api/v3/assets';
const PAGE_LIMIT = 100;
const DELAY_MS = 1000;

// Utility function to introduce a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch deleted assets from the bin API
async function fetchDeletedAssets() {
    let allAssets = [];
    let skip = 0;
    let totalCount = 0;

    do {
        try {
            const response = await fetch(BIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    api_key: API_KEY,
                    authtoken: AUTH_TOKEN,
                },
                body: JSON.stringify({
                    _method: 'GET',
                    skip,
                    limit: PAGE_LIMIT,
                    include_count: true,
                    query: {
                        $and: [
                            {
                                deleted_at: {
                                    $gte: '2024-12-14T00:00:00+05:30',
                                    $lte: '2024-12-14T23:59:59+05:30',
                                },
                            },
                            {
                                deleted_by: "user UID"   //user id provided
                            }
                        ],
                    },
                }),
            });

            const data = await response.json();
            console.log('API Response:', data);


            if (response.ok) {
                allAssets = allAssets.concat(data.assets || []);
                totalCount = data.count;
                skip += PAGE_LIMIT;

                console.log(`Fetched ${allAssets.length}/${totalCount} assets so far...`);

                if (skip < totalCount) {
                    await delay(DELAY_MS);
                }
            } else {
                console.error('Error fetching assets:', data);
                break;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            break;
        }
    } while (skip < totalCount);

    return allAssets;
}

// Function to restore an asset by its UID
async function restoreAsset(assetUid) {
    try {
        const response = await fetch(`${RESTORE_API_URL}/${assetUid}/restore?deleted=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                api_key: API_KEY,
                authtoken: AUTH_TOKEN,
            },
            body: JSON.stringify({
                asset: {
                    uid: assetUid,
                },
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`Successfully restored asset UID: ${assetUid}`);
        } else {
            console.error(`Error restoring asset UID: ${assetUid}`, data);
        }
    } catch (error) {
        console.error(`Restore error for asset UID: ${assetUid}`, error);
    }
}

// Main function to restore all deleted assets
async function restoreDeletedAssets() {
    const assets = await fetchDeletedAssets();

    console.log(`Total assets to restore: ${assets.length}`);

    for (const asset of assets) {
        await restoreAsset(asset.uid);
        await delay(DELAY_MS); // Delay between restore calls
    }

    console.log('All assets restoration process completed.');
}

// Start the process
restoreDeletedAssets();