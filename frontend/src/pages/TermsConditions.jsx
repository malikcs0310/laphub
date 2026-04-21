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

      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header - Mobile Optimized */}
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
              <FiFileText className="text-blue-600 text-xl sm:text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Terms & Conditions
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Effective from: April 2026
            </p>
          </div>

          {/* Content - Mobile Optimized */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            {/* Intro Box */}
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-5">
              <p className="text-gray-700 text-xs sm:text-sm">
                Welcome to{" "}
                <span className="font-semibold text-blue-600">LapHub.pk</span>.
                By accessing or using our website, you agree to be bound by
                these Terms & Conditions.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <FiShoppingCart className="text-blue-600 text-base sm:text-xl" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  1. Products & Pricing
                </h2>
              </div>
              <div className="space-y-1.5 sm:space-y-2 text-gray-600 text-xs sm:text-sm pl-5 sm:pl-8">
                <p>
                  • All products are genuine imported laptops with warranty.
                </p>
                <p>• Prices are subject to change without notice.</p>
                <p>• We reserve the right to modify or discontinue products.</p>
                <p>• Product images are for illustration purposes only.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <FiCreditCard className="text-blue-600 text-base sm:text-xl" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  2. Orders & Payments
                </h2>
              </div>
              <div className="space-y-1.5 sm:space-y-2 text-gray-600 text-xs sm:text-sm pl-5 sm:pl-8">
                <p>• All orders are subject to acceptance and availability.</p>
                <p>
                  • We accept Cash on Delivery, Bank Transfer, EasyPaisa, and
                  JazzCash.
                </p>
                <p>• Payment must be completed before order processing.</p>
                <p>• We reserve the right to cancel any order.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <FiTruck className="text-blue-600 text-base sm:text-xl" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  3. Shipping & Delivery
                </h2>
              </div>
              <div className="space-y-1.5 sm:space-y-2 text-gray-600 text-xs sm:text-sm pl-5 sm:pl-8">
                <p>• Free shipping on orders over Rs 50,000.</p>
                <p>• Delivery takes 3-5 business days nationwide.</p>
                <p>• We are not responsible for delivery delays.</p>
                <p>• Tracking information will be provided via email/SMS.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <FiRefreshCw className="text-blue-600 text-base sm:text-xl" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  4. Returns & Refunds
                </h2>
              </div>
              <div className="space-y-1.5 sm:space-y-2 text-gray-600 text-xs sm:text-sm pl-5 sm:pl-8">
                <p>• 7-day return policy for defective products.</p>
                <p>• Products must be in original condition.</p>
                <p>• Return shipping costs are customer's responsibility.</p>
                <p>• Refunds processed within 7-10 business days.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <FiAlertCircle className="text-blue-600 text-base sm:text-xl" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                  5. Limitation of Liability
                </h2>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm pl-5 sm:pl-8">
                LapHub.pk shall not be liable for any indirect, incidental, or
                consequential damages arising from the use of our products or
                website.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                6. Changes to Terms
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                We reserve the right to update these Terms & Conditions at any
                time. Changes will be effective immediately upon posting.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                7. Contact Information
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
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

            {/* Footer Note */}
            <div className="border-t pt-4 sm:pt-6 text-center text-gray-500 text-[10px] sm:text-xs">
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
