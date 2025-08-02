import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-white py-12 shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-800">Privacy Policy</h1>
          <p className="mt-2 text-gray-600">Last updated: August 02, 2025</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Welcome to KanoPrice. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy sets out how we collect, use, and protect any information that you give us when you use this application.
            </p>

            <h3>Information We Collect</h3>
            <p>We may collect the following information:</p>
            <ul>
              <li>
                <strong>Personal Identification Information:</strong> Name and email address when you create an account.
              </li>
              <li>
                <strong>User-Generated Content:</strong> Price contributions you submit, reviews and ratings you leave for shops, and information you provide when applying to become a shop owner.
              </li>
              <li>
                <strong>Shop Owner Information:</strong> If you apply to become a seller, we collect your shop name, contact details, market location, and other business-related information.
              </li>
            </ul>

            <h3>How We Use Your Information</h3>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>To create and manage your account.</li>
              <li>To display your contributions (like prices and reviews) to the community. Your name will be associated with your reviews.</li>
              <li>To process and verify shop owner applications.</li>
              <li>To improve our products and services.</li>
              <li>To ensure the security and integrity of our platform.</li>
            </ul>

            <h3>Data Security</h3>
            <p>
              We are committed to ensuring that your information is secure. We use Appwrite's secure, industry-standard authentication and database services to protect your data against unauthorized access or disclosure.
            </p>

            <h3>Your Control Over Your Information</h3>
            <p>
              You have control over your personal information. From your "My Account" page, you can:
            </p>
            <ul>
              <li>Update your name.</li>
              <li>Manage your price watchlist.</li>
              <li>View your contributions.</li>
            </ul>
            <p>
              If you wish to delete your account and all associated data, please contact us.
            </p>

            <h3>Changes to This Policy</h3>
            <p>
              We may update this policy from time to time by posting a new version on this page. We encourage you to check this page occasionally to ensure you are happy with any changes.
            </p>

            <h3>Contact Us</h3>
            <p>
              If you have any questions about this privacy policy, please don't hesitate to <Link to="/contact" className="text-green-600 font-semibold hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
