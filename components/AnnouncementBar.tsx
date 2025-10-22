export function AnnouncementBar() {
  const announcementText = "⚡ Quick delivery across India    •    ⚡ Ship within 24 hours    •    🎉 Free delivery for orders above ₹699*    •    🍃 Authentic teas & wellness blends    •    ✋ Handpicked quality, packed fresh    •    🏔️ From the hills to your cup";
  
  // Create seamless repetition with consistent spacing
  const repeatedText = Array(8).fill(announcementText).join('    •    ');

  return (
    <div className="bg-green-600 text-white w-full py-2 overflow-hidden announcement-bar">
      <div className="announcement-slider whitespace-nowrap">
        <span className="text-sm font-medium">
          {repeatedText}
        </span>
      </div>
    </div>
  );
}