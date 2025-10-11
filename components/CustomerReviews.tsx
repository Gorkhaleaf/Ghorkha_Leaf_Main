"use client";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const CustomerReviews = ({ reviews }: { reviews: Review[] }) => {
  // Default reviews if none provided
  const defaultReviews: Review[] = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Absolutely love this tea! The flavor is rich and authentic. Best Darjeeling tea I've had.",
      date: "2024-01-15",
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Excellent quality tea. Fast delivery and great packaging. Will order again!",
      date: "2024-01-10",
    },
    {
      name: "Anita Desai",
      rating: 4,
      comment: "Very good tea with a lovely aroma. Slightly pricey but worth it for the quality.",
      date: "2024-01-05",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  // Calculate dynamic review statistics
  const calculateStats = () => {
    if (displayReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        starDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const starDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    displayReviews.forEach((review) => {
      totalRating += review.rating;
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      starDistribution[rating]++;
    });

    return {
      averageRating: (totalRating / displayReviews.length).toFixed(1),
      totalReviews: displayReviews.length,
      starDistribution,
    };
  };

  const stats = calculateStats();

  const getStarPercentage = (starCount: 1 | 2 | 3 | 4 | 5) => {
    if (stats.totalReviews === 0) return 0;
    return Math.round((stats.starDistribution[starCount] / stats.totalReviews) * 100);
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Customer Reviews</h2>
      
      {/* Review Summary - Now Dynamic */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold">{stats.averageRating}</span>
            <div className="flex text-yellow-500 text-xl">
              {'★'.repeat(Math.round(Number(stats.averageRating)))}{'☆'.repeat(5-Math.round(Number(stats.averageRating)))}
            </div>
            <p className="text-sm text-gray-600">
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            {[5, 4, 3, 2, 1].map((stars) => {
              const starKey = stars as 1 | 2 | 3 | 4 | 5;
              const percentage = getStarPercentage(starKey);
              return (
                <div key={stars} className="flex items-center mb-1">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mx-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-sm">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-500">
                {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
              </div>
              <span className="ml-2 font-semibold">{review.name}</span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;