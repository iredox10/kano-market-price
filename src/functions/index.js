
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // Use the cors middleware

admin.initializeApp();

// This is an onRequest function, which gives us manual control over CORS.
exports.approveShopApplication = functions.https.onRequest((req, res) => {
  // 1. Wrap the entire function in the cors handler.
  cors(req, res, async () => {
    // Manually handle the OPTIONS preflight request from the browser
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // --- Authentication Check ---
    // We have to manually verify the user's token with onRequest.
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.role !== 'admin') {
        res.status(403).send({ error: 'Permission denied.' });
        return;
      }

      // --- Main Function Logic ---
      const { applicationId, userId } = req.body.data; // Data is in req.body.data
      if (!applicationId || !userId) {
        res.status(400).send({ error: 'Missing applicationId or userId.' });
        return;
      }

      const db = admin.firestore();
      const auth = admin.auth();

      // Set user role
      await auth.setCustomUserClaims(userId, { role: 'shopOwner' });

      // Get application data
      const applicationRef = db.collection('shopApplications').doc(applicationId);
      const applicationDoc = await applicationRef.get();
      if (!applicationDoc.exists) {
        res.status(404).send({ error: 'Application not found.' });
        return;
      }
      const appData = applicationDoc.data();

      // Create new shop owner document
      const shopData = {
        name: appData.shopName, market: appData.market, specialty: appData.specialty,
        phone: appData.phone, bio: appData.bio, imageUrl: appData.imageUrl || '',
        userId: userId, status: 'Verified', createdAt: new Date(),
      };
      await db.collection('allShopOwners').doc(userId).set(shopData);

      // Update application status
      await applicationRef.update({ status: 'approved' });

      // Send success response
      res.status(200).json({ data: { success: true, message: `Shop ${appData.shopName} has been approved.` } });

    } catch (error) {
      console.error("Error approving application:", error);
      res.status(500).send({ error: 'An unknown error occurred.' });
    }
  });
});
