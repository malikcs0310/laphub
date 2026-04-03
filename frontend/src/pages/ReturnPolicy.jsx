import React from "react";
import { Helmet } from "react-helmet-async";
import {
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTool,
  FiAlertCircle,
  FiInfo,
  FiWifi,
  FiBattery,
  FiMonitor,
  FiHardDrive,
  FiCpu,
  FiTruck,
  FiPackage,
  FiSmile,
  FiHelpCircle,
  FiTrendingUp,
} from "react-icons/fi";

const ReturnPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Warranty & Check Policy - LapHub.pk</title>
        <meta
          name="description"
          content="LapHub.pk 7 days check warranty on imported used laptops. Test your laptop for 7 days. Issue resolution only."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiShield className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Warranty & Check Policy
            </h1>
            <p className="text-gray-500">
              For Imported Used Laptops | Last updated: April 2026
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            {/* Important Notice */}
            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <FiInfo className="text-blue-600 text-xl" />
                <p className="font-bold text-blue-700 text-lg">
                  Important Note
                </p>
              </div>
              <p className="text-gray-700">
                We sell <strong>genuine imported used laptops</strong> from USA,
                UK, Japan, and Germany. All laptops are thoroughly tested before
                shipping. We offer a{" "}
                <strong className="text-green-700">7-day check warranty</strong>
                for issue resolution.{" "}
                <strong className="text-red-600">
                  No replacements or refunds.
                </strong>
              </p>
            </div>

            {/* 7 Days Check Warranty */}
            <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <FiCheckCircle className="text-green-600 text-xl" />
                <p className="font-bold text-green-700 text-lg">
                  7 Days Check Warranty
                </p>
              </div>
              <p className="text-gray-700">
                Every laptop comes with a <strong>7-day check warranty</strong>{" "}
                from the date of delivery. You can thoroughly test the laptop
                for 7 days. If you find any hardware issue, contact us
                immediately. We will <strong>resolve the issue</strong> at our
                end.
              </p>
            </div>

            {/* What is Covered */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                What is Covered
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMonitor className="text-blue-500" /> Display issues
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiTool className="text-blue-500" /> Keyboard/Trackpad issues
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiBattery className="text-blue-500" /> Battery charging
                  issues
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiTool className="text-blue-500" /> Ports not working
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiWifi className="text-blue-500" /> Wi-Fi/Bluetooth issues
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiHardDrive className="text-blue-500" /> Storage/RAM issues
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCpu className="text-blue-500" /> Overheating issues
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiTool className="text-blue-500" /> Any hardware malfunction
                </div>
              </div>
            </section>

            {/* What is NOT Covered */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiXCircle className="text-red-600" />
                What is NOT Covered
              </h2>
              <div className="space-y-2 text-gray-600 pl-8">
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Physical damage (drops, liquid spills, cracks)</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Software issues (Windows installation, drivers, virus)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Damage from unauthorized repair attempts</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Normal wear and tear (scratches, cosmetic issues)</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Battery degradation (normal for used laptops)</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Accessories (charger, bag)</span>
                </div>
              </div>
            </section>

            {/* Resolution Process */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-blue-600" />
                Issue Resolution Process
              </h2>
              <div className="space-y-3 text-gray-600 pl-8">
                <p>
                  1. <strong>Within 7 days</strong> of receiving the laptop,
                  test all features
                </p>
                <p>
                  2. If you find any issue, contact us immediately with
                  photos/videos
                </p>
                <p>3. Our team will diagnose the issue remotely</p>
                <p>
                  4. If issue requires physical inspection, send laptop back to
                  us
                </p>
                <p>
                  5. We will <strong>repair/resolve the issue</strong> at our
                  workshop
                </p>
                <p>6. Laptop will be returned to you after resolution</p>
                <p className="text-orange-600 font-medium flex items-center gap-2">
                  <FiAlertCircle />
                  Note: No replacements or refunds. Only issue resolution.
                </p>
              </div>
            </section>

            {/* Shipping for Resolution */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiTruck className="text-purple-600" />
                Shipping for Resolution
              </h2>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>
                  • Customer will bear <strong>one-way shipping cost</strong> to
                  send laptop back
                </p>
                <p>• We will bear return shipping after resolution</p>
                <p>• Use reliable courier service with tracking</p>
                <p>• Pack laptop securely to avoid damage during transit</p>
              </div>
            </section>

            {/* Resolution Timeline */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-green-600" />
                Resolution Timeline
              </h2>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>
                  • <strong>Diagnosis:</strong> 1-2 business days after
                  receiving laptop
                </p>
                <p>
                  • <strong>Repair:</strong> 3-5 business days depending on
                  issue
                </p>
                <p>
                  • <strong>Return Shipping:</strong> 2-3 business days
                </p>
                <p>• Total resolution time: 7-10 business days</p>
              </div>
            </section>

            {/* Cosmetic Condition */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiMonitor className="text-orange-600" />
                Cosmetic Condition
              </h2>
              <div className="space-y-2 text-gray-600 pl-8">
                <p>• Used laptops may have minor scratches or signs of use</p>
                <p>• We mention the condition in product description</p>
                <p>
                  • Cosmetic issues are <strong>not covered</strong> under
                  warranty
                </p>
                <p>• Please check product photos carefully before ordering</p>
              </div>
            </section>

            {/* Battery Note */}
            <div className="bg-yellow-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiBattery className="text-yellow-600 text-xl" />
                <p className="font-bold text-yellow-700">
                  Important Note About Battery
                </p>
              </div>
              <p className="text-gray-700">
                Used laptops have <strong>70-85% battery health</strong>{" "}
                compared to new. This is normal for used laptops. We test all
                batteries to ensure minimum
                <strong> 2-3 hours of backup</strong>. Battery replacement is
                not covered under warranty as battery degradation is natural for
                used laptops.
              </p>
            </div>

            {/* What We Will Do */}
            <div className="bg-green-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiTool className="text-green-600 text-xl" />
                <p className="font-bold text-green-700">What We Will Do</p>
              </div>
              <ul className="space-y-2 text-gray-700 pl-6">
                <li className="flex items-center gap-2">
                  → Diagnose the issue
                </li>
                <li className="flex items-center gap-2">
                  → Repair hardware issues
                </li>
                <li className="flex items-center gap-2">
                  → Replace faulty components (if available)
                </li>
                <li className="flex items-center gap-2">
                  → Resolve the problem and return laptop
                </li>
              </ul>
            </div>

            {/* What We Will NOT Do */}
            <div className="bg-red-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiXCircle className="text-red-600 text-xl" />
                <p className="font-bold text-red-700">What We Will NOT Do</p>
              </div>
              <ul className="space-y-2 text-gray-700 pl-6">
                <li className="flex items-center gap-2">
                  → No replacement with different laptop
                </li>
                <li className="flex items-center gap-2">
                  → No refund of money
                </li>
                <li className="flex items-center gap-2">
                  → No exchange for another model
                </li>
                <li className="flex items-center gap-2">
                  → No return after 7 days
                </li>
              </ul>
            </div>

            {/* Condition Grades */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" />
                Laptop Condition Grades
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Grade</th>
                      <th className="px-4 py-2 text-left">Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-green-600">
                        Grade A
                      </td>
                      <td className="px-4 py-2">
                        Like new, minimal signs of use
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-blue-600">
                        Grade B
                      </td>
                      <td className="px-4 py-2">
                        Good condition, normal signs of use
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-orange-600">
                        Grade C
                      </td>
                      <td className="px-4 py-2">
                        Visible scratches but fully functional
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Summary */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">
                Policy Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Period</th>
                      <th className="px-4 py-2 text-left">What We Do</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">Day 1-7</td>
                      <td className="px-4 py-2">Issue resolution (repair)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">After 7 days</td>
                      <td className="px-4 py-2">Not covered</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gray-50 rounded-xl p-5 mt-6">
              <div className="flex flex-col items-center gap-2">
                <p className="text-gray-700">
                  For warranty claims or questions, contact us:
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="tel:+923104082056"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <FiTool /> +92 310 408 2056
                  </a>
                  <a
                    href="mailto:warranty@laphub.pk"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <FiPackage /> warranty@laphub.pk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicy;
