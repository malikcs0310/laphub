import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiShoppingCart,
  FiCreditCard,
  FiTruck,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

const TermsConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - LapHub.pk</title>
        <meta
          name="description"
          content="LapHub.pk terms and conditions - Read our terms of service before using our website."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiFileText className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Terms & Conditions
            </h1>
            <p className="text-gray-500">Effective from: April 2026</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-gray-700">
                Welcome to{" "}
                <span className="font-semibold text-blue-600">LapHub.pk</span>.
                By accessing or using our website, you agree to be bound by
                these Terms & Conditions.
              </p>
            </div>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiShoppingCart className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  1. Products & Pricing
                </h2>
              </div>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>
                  • All products are genuine imported laptops with warranty.
                </p>
                <p>• Prices are subject to change without notice.</p>
                <p>• We reserve the right to modify or discontinue products.</p>
                <p>• Product images are for illustration purposes only.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiCreditCard className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  2. Orders & Payments
                </h2>
              </div>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>• All orders are subject to acceptance and availability.</p>
                <p>
                  • We accept Cash on Delivery, Bank Transfer, EasyPaisa, and
                  JazzCash.
                </p>
                <p>• Payment must be completed before order processing.</p>
                <p>• We reserve the right to cancel any order.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiTruck className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  3. Shipping & Delivery
                </h2>
              </div>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>• Free shipping on orders over Rs 50,000.</p>
                <p>• Delivery takes 3-5 business days nationwide.</p>
                <p>• We are not responsible for delivery delays.</p>
                <p>• Tracking information will be provided via email/SMS.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiRefreshCw className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  4. Returns & Refunds
                </h2>
              </div>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>• 7-day return policy for defective products.</p>
                <p>• Products must be in original condition.</p>
                <p>• Return shipping costs are customer's responsibility.</p>
                <p>• Refunds processed within 7-10 business days.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <FiAlertCircle className="text-blue-600 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  5. Limitation of Liability
                </h2>
              </div>
              <p className="text-gray-600 pl-8">
                LapHub.pk shall not be liable for any indirect, incidental, or
                consequential damages arising from the use of our products or
                website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                6. Changes to Terms
              </h2>
              <p className="text-gray-600">
                We reserve the right to update these Terms & Conditions at any
                time. Changes will be effective immediately upon posting.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                7. Contact Information
              </h2>
              <p className="text-gray-600">
                Questions about Terms? Contact us at:
                <br />
                <a
                  href="mailto:legal@laphub.pk"
                  className="text-blue-600 hover:underline"
                >
                  legal@laphub.pk
                </a>
              </p>
            </section>

            <div className="border-t pt-6 text-center text-gray-500 text-sm">
              <p>
                By using our website, you agree to these Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
