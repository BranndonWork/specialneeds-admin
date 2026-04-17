import { Rating } from "react-simple-star-rating";
import Tooltip from "../../Shared/Tooltip";
import Avatar from "./Avatar";
import moment from "moment";
import { getQuestionDescription } from "../RatingQuestions";
const Review = ({ review, editReview }) => {
  if (review?.ratings === undefined) {
    return null;
  }

  let wrapperClass = "pt-2 pb-2 user-review";

  if (review.ratings.averageRating < 3) {
    wrapperClass += " user-review-negative";
  }

  if (review.ratings.averageRating >= 3 && review.ratings.averageRating < 4) {
    wrapperClass += " user-review-neutral";
  }

  if (review.ratings.averageRating >= 4) {
    wrapperClass += " user-review-positive";
  }

  // create a Date object with the UTC time
  const utcDate = new Date(review.created_at);

  // get the local time offset in minutes
  const offsetMinutes = new Date().getTimezoneOffset();

  // convert the UTC time to the local time by adding the offset
  const localDate = new Date(utcDate.getTime() - offsetMinutes * 60 * 1000);

  // use moment to format the date in local time
  review.dateRelative = moment(localDate).fromNow();
  review.dateFull = moment(localDate).format("MMMM Do YYYY, h:mm:ss a");

  // sort the review.ratings by key
  const sortedRatings = {};
  Object.keys(review.ratings)
    .sort()
    .forEach(function (key) {
      sortedRatings[key] = review.ratings[key];
    });
  review.ratings = sortedRatings;
  console.log("Review Final:", review);
  return (
    <div className={wrapperClass} key={review.id}>
      <div className="row m-3">
        <div className="col-3 p-2">
          <div className="user">
            <div className="avatar-wrapper">
              <Avatar avatarURL={review.avatar} style={{ textAlign: "center" }} />
            </div>
            <div className="username-wrapper">
              <strong>{review.displayname}</strong>
            </div>
          </div>
        </div>

        <div className="col-9 p-2">
          <div className="comments">
            <span
              className="rating"
              onClick={(e) => {
                // toggle full-ratings
                const fullRatings = e.target.closest(".review").querySelector(".full-ratings");
                if (fullRatings.style.display === "none") {
                  fullRatings.style.display = "block";
                } else {
                  fullRatings.style.display = "none";
                }
              }}
            >
              <Tooltip
                splitLinesAfter={null}
                anchorText={
                  <Rating
                    style={{ paddingBottom: "10px" }}
                    allowFraction={true}
                    size="20"
                    readonly={true}
                    allowTitleTag={false}
                    initialValue={
                      review.ratings?.averageRating ? parseFloat(review.ratings.averageRating) : 5
                    }
                  />
                }
                content={
                  "<center>" +
                  String(parseFloat(review.ratings.averageRating)) +
                  " out of 5<br/>Tap stars to toggle full rating</center>"
                }
              />
            </span>
            <div className="full-ratings" style={{ display: "none" }}>
              <table>
                <tbody>
                  {Object.entries(review.ratings).map((rating_key) => {
                    const rating = {
                      key: rating_key[0],
                      value: rating_key[1],
                    };
                    if (rating.key === "averageRating") {
                      return null;
                    }
                    if (rating.value === 0) {
                      return null;
                    }

                    return (
                      <tr key={rating.key}>
                        <td>
                          <strong>
                            <Tooltip
                              anchorText={rating.key}
                              content={getQuestionDescription(rating.key)}
                            />
                          </strong>
                        </td>
                        <td> </td>
                        <td>
                          <Rating
                            style={{ paddingBottom: "6px" }}
                            allowFraction={true}
                            size="16"
                            readonly={true}
                            allowTitleTag={false}
                            initialValue={rating.value}
                          />{" "}
                          <span style={{ color: "gray" }}>
                            {
                              // show one decimal place
                              String(parseFloat(rating.value)).length === 1
                                ? String(parseFloat(rating.value)) + ".0"
                                : String(parseFloat(rating.value))
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p dangerouslySetInnerHTML={{ __html: review.content }}></p>

            <div className="date float-right">
              <Tooltip anchorText={review.dateRelative} content={review.dateFull} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
