
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error, variables }) => {
  const client = new sdk.Client();
  const databases = new sdk.Databases(client);

  const env = variables || process.env;

  try {
    if (!env.APPWRITE_FUNCTION_ENDPOINT || !env.APPWRITE_FUNCTION_PROJECT_ID || !env.APPWRITE_FUNCTION_API_KEY) {
      throw new Error("Function environment variables are not set.");
    }

    client
      .setEndpoint(env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(env.APPWRITE_FUNCTION_API_KEY);

    // --- THE FIX ---
    // For event-triggered functions, the data is in an environment variable.
    const newReview = JSON.parse(env.APPWRITE_FUNCTION_EVENT_DATA);
    const shopOwnerId = newReview.shopOwnerId;

    if (!shopOwnerId) {
      throw new Error("Missing 'shopOwnerId' in the new review data.");
    }

    log(`Processing new review for shopOwnerId: ${shopOwnerId}`);

    // 2. Fetch all reviews for that specific shop owner
    const reviewsResponse = await databases.listDocuments(
      env.DATABASE_ID,
      env.REVIEWS_COLLECTION_ID,
      [sdk.Query.equal('shopOwnerId', shopOwnerId)]
    );

    const reviews = reviewsResponse.documents;
    const reviewCount = reviews.length;

    // 3. Calculate the new average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    log(`Calculated new rating: ${averageRating.toFixed(2)} from ${reviewCount} reviews.`);

    // 4. Update the shop owner's document with the new stats
    await databases.updateDocument(
      env.DATABASE_ID,
      env.SHOP_OWNERS_COLLECTION_ID,
      shopOwnerId,
      {
        reviewCount: reviewCount,
        averageRating: averageRating,
      }
    );

    log(`Successfully updated ratings for shop: ${shopOwnerId}`);
    return res.json({ success: true });

  } catch (err) {
    error(`!!! RATING FUNCTION FAILED !!!: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};
