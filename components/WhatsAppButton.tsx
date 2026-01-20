"use client";

import Image from "next/image";

export default function WhatsAppButton() {
  const phoneNumber = "917204390477"; // Replace with your WhatsApp number
  const message = "Hi! I want to know more about your tea products.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed left-4 bottom-6 z-50"
    >
      <div className="bg-green-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
        <Image
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={32}
          height={32}
          priority
        />
      </div>
    </a>
  );
}
