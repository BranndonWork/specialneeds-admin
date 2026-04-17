import Utils from "@utils";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import Review from "./Review";

const Reviews = ({ listing, enableAddReview }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [editingReview, setEditingReview] = useState(false);

  useEffect(() => {
    if (listing?.id) {
      // refresh the reviews on initial load
      refreshReviews(30);
    }
  }, [listing, refreshReviews]);

  const refreshReviews = useCallback(async () => {
    const response = await fetch(`/api/v1/listings/reviews/${listing.id}`).then(r => r.json());
    if (response?.reviews && Array.isArray(response.reviews) && response.reviews.length > 0) {
      const reviews = response.reviews.map((review) => {
        review.avatar =
          review.avatar ||
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=n";
        return review;
      });
      reviews.push({
        id: "bed4e17c-7bf5-489f-87e2-7720924efab5",
        user_id: 123456,
        listing_id: "bd86a6ae-7c2a-4bb7-bbd1-c465e9aeafd1",
        ratings: {
          averageRating: 3,
          qualifications: 5,
          "equipment/Supplies": 5,
          "camper/StaffRatio": 5,
          behavioralSupport: 1,
          "activities/Programs": 5,
          socialSkillsSupport: 5,
        },
        content:
          "<p>Listen up, you bunch of scurvy dogs! If you're looking for a camp that'll make you feel like a true Ravager, look no further than this one! I recently went to this camp and let me tell you, it was a blast! It's a co-ed camp, so you can meet some pretty interesting people there. The age range is from 7 to 25, so you can expect some young bloods and some old-timers like me.</p><p>The camp is in the desert, which was pretty cool. It's a unique setting that you don't see every day. The best part of this camp is that it's integrated, so it's not just for able-bodied campers. Disabled campers are welcome, too! We had a great time exploring our abilities and overcoming social boundaries together.</p><p>As for activities, there's aquatic activities like swimming and baseball/softball. If you're a Ravager like me, you'll love the aquatic activities. They were so much fun! There's also 4-H clubs, so you can learn some pretty useful skills.</p><p>If you're worried about the cost, don't be! Financial aid is available, so you can still have a great time even if you're short on credits. The only downside is that there's no transportation available, so you'll have to find your own way to the camp.</p><p>Overall, I had a great time at this camp and I would definitely recommend it to anyone looking for a unique, integrated camp experience. Director Buck Prentiss runs a tight ship and the staff is great. So what are you waiting for? Sign up and join the Ravagers!</p>",
        created_at: "2022-01-15T19:50:05.778Z",
        updated_at: "2022-01-17T00:43:43.655Z",
        avatar: "https://i.ytimg.com/vi/bpJDXtk__To/maxresdefault.jpg",
        status: status === "published",
        displayname: "Tazerface",
      });

      setReviews(reviews);
    }
    setReviewsLoaded(true);
  }, [listing.id]);

  const getAverageRating = (review) => {
    let reviewTotal = 0;
    let reviewCount = 0;
    for (let ratingKey in review.ratings) {
      if (ratingKey === "averageRating") continue;
      const ratingScore = parseFloat(review.ratings[ratingKey]);
      if (ratingScore == 0) continue;
      reviewTotal += ratingScore;
      reviewCount++;
    }
    return reviewTotal / reviewCount;
  };

  const onUpdated = (updatedReview) => {
    setEditingReview(false);
    setReviews(
      reviews.map((review) => {
        if (review.id === updatedReview.id) {
          console.log("Setting review content...", {
            updatedReview: updatedReview,
            review: review,
            reviewId: review.id,
            updatedReviewId: updatedReview.id,
          });
          review.content = updatedReview.content;
          review.ratings = updatedReview.ratings;
          review.ratings.averageRating = getAverageRating(updatedReview);
        }
        return review;
      })
    );
  };

  const editReview = (review) => {
    setEditingReview(true);
  };

  const onSubmitted = (review) => {
    setReviews([...reviews, review]);
    setEditingReview(false);
  };

  const onCancel = () => {
    setEditingReview(false);
  };

  const userHasReview = () => {
    return false;
  };

  return (
    <>
      {!reviewsLoaded ? (
        <>
          <br />
          <Spinner color="success" className="product-spinner" animation="border" size="sm" />{" "}
          Loading reviews...
        </>
      ) : (
        <div id="reviews-wrapper">
          <div className="reviews-header">
            <h4>Reviews</h4>
            {!userHasReview() && reviews.length > 0 && (
              <div className="row mb-3">
                <div className="col-3 p-2"></div>
                <div className="col-9 p-2">
                  <div className="review-buttons float-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        // scroll to .reviews-footer
                        const reviewsFooter = document.querySelector(".reviews-footer");
                        const offset =
                          reviewsFooter.getBoundingClientRect().top + window.pageYOffset - 100;
                        // slow scroll to the reviews footer
                        window.scrollTo({
                          top: offset,
                          behavior: "smooth",
                        });
                        // click into #reviewContent
                        const reviewContent = document.querySelector("#reviewContent");
                        reviewContent.focus();
                      }}
                    >
                      {" "}
                      Add Your Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="listings-review-comments">
            {/* show no reviews until we actually get some reviews loaded */}
            {reviews.length === 0 && (
              <div className="no-reviews mb-3">No reviews yet, add one below!</div>
            )}

            {/* displaying the reviews */}
            {reviews &&
              reviews.map((review) => {
                const key = Utils.contentHash(review);
                return (
                  <span className="review" key={key}>
                    <Review review={review} editReview={editReview} />
                  </span>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
