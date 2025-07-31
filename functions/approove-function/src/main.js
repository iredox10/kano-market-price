
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error, variables }) => {
  const client = new sdk.Client();
  const databases = new sdk.Databases(client);
  const teams = new sdk.Teams(client);
  const users = new sdk.Users(client);

  const env = variables || process.env;

  try {
    if (
      !env.APPWRITE_FUNCTION_ENDPOINT ||
      !env.APPWRITE_FUNCTION_PROJECT_ID ||
      !env.APPWRITE_FUNCTION_API_KEY
    ) {
      throw new Error("Missing Appwrite function environment variables.");
    }

    client
      .setEndpoint(env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(env.APPWRITE_FUNCTION_API_KEY);

    log("Function initialized.");

    const callingUserId = req.headers['x-appwrite-user-id'];
    if (!callingUserId) {
      throw new Error("This function can only be called by an authenticated user.");
    }

    const callingUserData = await users.get(callingUserId);
    const userLabels = callingUserData.labels || [];
    if (!userLabels.includes('admin')) {
      throw new Error("Permission denied. You must be an admin to perform this action.");
    }
    log("Admin permission verified.");

    const payload = JSON.parse(req.body || req.payload || '{}');
    const { applicationId, userId } = payload;

    if (!applicationId || !userId) {
      throw new Error("Payload must include both 'applicationId' and 'userId'.");
    }

    log(`Processing application: ${applicationId} for user: ${userId}`);

    // Step 1: Get application data
    const appData = await databases.getDocument(
      env.DATABASE_ID,
      env.SHOP_APPLICATIONS_COLLECTION_ID,
      applicationId
    );
    log("Application document fetched successfully.");

    // --- NEW: Check if application is already approved ---
    if (appData.status === 'approved') {
      log("This application has already been approved. Exiting.");
      return res.json({ success: true, message: `Shop '${appData.shopName}' was already approved.` });
    }

    // Step 2: Add user to shopOwners team
    try {
      await teams.createMembership(
        env.SHOP_OWNERS_TEAM_ID,
        ['owner'],
        appData.userEmail,
        userId,
        undefined,
        undefined,
        appData.shopName
      );
      log("User added to team successfully.");
    } catch (teamError) {
      // If the user is already a member, log it and continue
      if (teamError.code === 409) { // 409 is the conflict code for existing membership
        log("User is already a member of the shopOwners team. Skipping.");
      } else {
        throw teamError; // If it's a different error, stop the process
      }
    }

    // Step 3: Update the user's document to set their role
    await databases.updateDocument(
      env.DATABASE_ID,
      env.USERS_COLLECTION_ID,
      userId,
      { role: 'shopOwner' }
    );
    log("User role updated to 'shopOwner'.");


    // Step 4: Create shopOwner document
    await databases.createDocument(
      env.DATABASE_ID,
      env.SHOP_OWNERS_COLLECTION_ID,
      userId,
      {
        name: appData.shopName,
        specialty: appData.speciality,
        bio: appData.bio,
        phone: appData.phone,
        whatsapp: appData.whatsapp,
        openingHours: appData.openingHours,
        market: appData.market,
        userId: userId,
        status: 'Verified',
      }
    );
    log("Shop owner document created.");

    // Step 5: Update application status
    await databases.updateDocument(
      env.DATABASE_ID,
      env.SHOP_APPLICATIONS_COLLECTION_ID,
      applicationId,
      { status: 'approved' }
    );
    log("Application status updated to 'approved'.");

    return res.json({
      success: true,
      message: `Shop '${appData.shopName}' approved successfully.`,
    });

  } catch (err) {
    error("!!! FUNCTION FAILED !!!");
    error(err);
    return res.json({ success: false, error: err.message }, 500);
  }
};
