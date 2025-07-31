// functions/approve-function/index.js
const sdk = require('node-appwrite');

module.exports = async (req, res) => {
  const client = new sdk.Client();
  const databases = new sdk.Databases(client);
  const teams = new sdk.Teams(client);

  try {
    // --- CORRECT SYNTAX FOR APPWRITE FUNCTIONS ---
    // Appwrite functions get their variables from the `req.variables` object.
    // This is different from your frontend React code which uses `import.meta.env`.
    if (
      !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
      !req.variables['APPWRITE_FUNCTION_PROJECT_ID'] ||
      !req.variables['APPWRITE_FUNCTION_API_KEY']
    ) {
      throw new Error("Function environment variables are not set correctly in your Appwrite console.");
    }

    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

    console.log("Function initialized successfully.");

    const payload = JSON.parse(req.payload);
    const { applicationId, userId } = payload;

    console.log(`Processing application: ${applicationId} for user: ${userId}`);

    // 1. Get the application data
    console.log("Step 1: Fetching application document...");
    const appData = await databases.getDocument(
      req.variables['DATABASE_ID'],
      req.variables['SHOP_APPLICATIONS_COLLECTION_ID'],
      applicationId
    );
    console.log("...Application data fetched successfully.");

    // 2. Add the user to the 'shopOwners' team
    console.log("Step 2: Adding user to shopOwners team...");
    await teams.createMembership(
      req.variables['SHOP_OWNERS_TEAM_ID'],
      [], // User's roles within the team
      undefined,
      appData.userEmail,
      userId,
      undefined,
      appData.shopName
    );
    console.log("...User added to team successfully.");

    // 3. Create a new document in the 'shopOwners' collection
    console.log("Step 3: Creating shopOwner document...");
    await databases.createDocument(
      req.variables['DATABASE_ID'],
      req.variables['SHOP_OWNERS_COLLECTION_ID'],
      userId, // Use the userId as the document ID
      {
        name: appData.shopName,
        specialty: appData.speciality, // Ensure this matches the attribute in your collection
        bio: appData.bio,
        phone: appData.phone,
        whatsapp: appData.whatsapp,
        openingHours: appData.openingHours,
        market: appData.market,
        userId: userId,
        status: 'Verified',
      }
    );
    console.log("...shopOwner document created successfully.");

    // 4. Update the application status to 'approved'
    console.log("Step 4: Updating application status...");
    await databases.updateDocument(
      req.variables['DATABASE_ID'],
      req.variables['SHOP_APPLICATIONS_COLLECTION_ID'],
      applicationId,
      { status: 'approved' }
    );
    console.log("...Application status updated successfully.");

    res.json({ success: true, message: `Shop ${appData.shopName} has been approved.` });

  } catch (error) {
    console.error("!!! FUNCTION FAILED !!!");
    console.error(error);
    res.json({ error: `Function failed: ${error.message}` }, 500);
  }
};
