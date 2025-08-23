interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const CustomerReviews = ({ reviews }: { reviews: Review[] }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Customer Reviews</h2>
      
      {/* Review Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold">4.8</span>
            <div className="flex text-yellow-500 text-xl">★★★★★</div>
            <p className="text-sm text-gray-600">Based on 156 reviews</p>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-1">
              <span className="text-sm w-8">5★</span>
              <div className="w-32 bg-gray-200 rounded-full h-2 mx-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
              <span className="text-sm">85%</span>
            </div>
            <div className="flex items-center mb-1">
              <span className="text-sm w-8">4★</span>
              <div className="w-32 bg-gray-200 rounded-full h-2 mx-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '10%'}}></div>
              </div>
              <span className="text-sm">10%</span>
            </div>
            <div className="flex items-center mb-1">
              <span className="text-sm w-8">3★</span>
              <div className="w-32 bg-gray-200 rounded-full h-2 mx-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '3%'}}></div>
              </div>
              <span className="text-sm">3%</span>
            </div>
            <div className="flex items-center mb-1">
              <span className="text-sm w-8">2★</span>
              <div className="w-32 bg-gray-200 rounded-full h-2 mx-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '1%'}}></div>
              </div>
              <span className="text-sm">1%</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm w-8">1★</span>
              <div className="w-32 bg-gray-200 rounded-full h-2 mx-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '1%'}}></div>
              </div>
              <span className="text-sm">1%</span>
            </div>
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