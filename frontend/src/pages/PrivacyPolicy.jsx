import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiLock,
  FiEye,
  FiMail,
  FiTrash2,
  FiClock,
} from "react-icons/fi";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - LapHub.pk</title>
        <meta
          name="description"
          content="LapHub.pk privacy policy - Learn how we collect, use, and protect your personal information."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiShield className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Privacy Policy
            </h1>
            <p className="text-gray-500">Last updated: April 2026</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-gray-700">
                At{" "}
                <span className="font-semibold text-blue-600">LapHub.pk</span>,
                we take your privacy seriously. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when
                you visit our website.
              </p>
            </div>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiEye className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  1. Information We Collect
                </h2>
              </div>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, shipping address.
                </p>
                <p>
                  <strong>Order Information:</strong> Products purchased, order
                  history, payment details.
                </p>
                <p>
                  <strong>Technical Information:</strong> IP address, browser
                  type, device information.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiLock className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  2. How We Use Your Information
                </h2>
              </div>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>✓ Process and fulfill your orders</p>
                <p>✓ Communicate with you about your orders</p>
                <p>✓ Improve our products and services</p>
                <p>✓ Send promotional offers (with your consent)</p>
                <p>✓ Prevent fraudulent transactions</p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiMail className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  3. Information Sharing
                </h2>
              </div>
              <p className="text-gray-600 pl-8">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information with shipping
                partners, payment processors, and as required by law.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiTrash2 className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  4. Your Rights
                </h2>
              </div>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>✓ Access your personal information</p>
                <p>✓ Correct inaccurate information</p>
                <p>✓ Request deletion of your information</p>
                <p>✓ Opt-out of marketing communications</p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiClock className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  5. Data Security
                </h2>
              </div>
              <p className="text-gray-600 pl-8">
                We implement industry-standard security measures to protect your
                personal information. However, no method of transmission over
                the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                6. Contact Us
              </h2>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy, please contact
                us at:
                <br />
                <a
                  href="mailto:privacy@laphub.pk"
                  className="text-blue-600 hover:underline"
                >
                  privacy@laphub.pk
                </a>
              </p>
            </section>

            <div className="border-t pt-6 text-center text-gray-500 text-sm">
              <p>By using our website, you consent to this Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
