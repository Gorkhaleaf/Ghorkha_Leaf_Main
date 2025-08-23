export function AnnouncementBar() {
  const announcementText = "🚚 We deliver internationally    •    ⚡ Ship within 24 hours    •    🎉 Free delivery for orders above ₹699*    •    🍃 Premium tea leaves sourced directly from Darjeeling";
  
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