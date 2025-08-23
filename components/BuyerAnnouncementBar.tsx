'use client'
import buyersData from '@/lib/buyers.json'

interface Buyer {
  name: string
  product: string
  timeAgo: string
  location: string
}

export function BuyerAnnouncementBar() {
  const buyers: Buyer[] = buyersData;

  const generateAnnouncementText = () => {
    return buyers.map((buyer) =>
      `🎉 ${buyer.name} bought ${buyer.product} ${buyer.timeAgo} from ${buyer.location}`
    ).join('    •    ');
  };

  const announcementText = generateAnnouncementText();
  // Create seamless repetition for continuous scroll
  const repeatedText = Array(6).fill(announcementText).join('    •    ');

  return (
    <div
      className="w-full buyer-announcement-bar"
      style={{
        backgroundColor: '#14532d',
        paddingTop: '3rem',
        paddingBottom: '3rem'
      }}
    >
      <div className="buyer-announcement-slider whitespace-nowrap">
        <span
          className="text-xl md:text-2xl lg:text-3xl font-bold italic tracking-wide"
          style={{ color: '#e8c076' }}
        >
          {repeatedText}
        </span>
      </div>
    </div>
  );
}