import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiRefreshCw,
  FiShield,
  FiPhone,
  FiMail,
} from "react-icons/fi";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Are the laptops genuine?",
      answer:
        "Yes, all laptops at LapHub.pk are 100% genuine imported laptops with official manufacturer warranty. We never sell refurbished or fake products.",
      icon: FiShield,
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery typically takes 3-5 business days across Pakistan. You'll receive tracking information once your order is shipped.",
      icon: FiTruck,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Cash on Delivery (COD), Bank Transfer, EasyPaisa, and JazzCash. Card payments coming soon!",
      icon: FiCreditCard,
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 7-day return policy for defective or damaged products. Please contact us within 7 days of delivery to initiate a return.",
      icon: FiRefreshCw,
    },
    {
      question: "Do you offer warranty?",
      answer:
        "Yes, all laptops come with manufacturer warranty. Warranty period varies by brand and model. Contact us for specific warranty details.",
      icon: FiShield,
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive a tracking number via email/SMS. You can also track your order from your account dashboard.",
      icon: FiPackage,
    },
    {
      question: "Do you deliver nationwide?",
      answer:
        "Yes, we deliver to all cities across Pakistan. Shipping is free on orders over Rs 50,000.",
      icon: FiTruck,
    },
    {
      question: "Can I change or cancel my order?",
      answer:
        "Orders can be cancelled within 24 hours of placement. Please contact us immediately if you need to modify your order.",
      icon: FiRefreshCw,
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>FAQ - LapHub.pk</title>
        <meta
          name="description"
          content="Frequently asked questions about LapHub.pk - Shipping, payments, returns, warranty, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiPackage className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-500">
              Find answers to common questions about LapHub.pk
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-gray-100 last:border-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Icon className="text-blue-600" size={18} />
                      </div>
                      <span className="font-medium text-gray-800">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <FiChevronUp className="text-gray-400 flex-shrink-0" />
                    ) : (
                      <FiChevronDown className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pl-14">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              We're here to help! Contact us anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+923104082056"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                <FiPhone size={16} />
                Call Us
              </a>
              <a
                href="mailto:support@laphub.pk"
                className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition"
              >
                <FiMail size={16} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
