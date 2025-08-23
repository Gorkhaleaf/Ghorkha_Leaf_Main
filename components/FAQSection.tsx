"use client"

import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "What is the best way to store tea?",
      answer: "Store in a cool, dry place away from light in an airtight container."
    },
    {
      question: "How many cups can I make from 100g?",
      answer: "Approximately 40-50 cups depending on strength preference."
    },
    {
      question: "Is this tea caffeine-free?",
      answer: "No, this black tea contains natural caffeine. For caffeine-free options, try our herbal teas."
    },
    {
      question: "Can I add milk to this tea?",
      answer: "Yes, this tea works excellently with milk and is perfect for making traditional chai."
    },
    {
      question: "What's the shelf life?",
      answer: "Best consumed within 24 months of manufacturing date when stored properly."
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center text-green-800">You Asked, We Answered</h2>
      
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 mb-4">
            <button
              className="w-full text-left py-4 flex justify-between items-center hover:bg-gray-50"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium">{faq.question}</span>
              <span className="text-green-600">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;