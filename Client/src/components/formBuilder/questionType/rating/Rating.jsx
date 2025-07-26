import { useState } from "react";
import StarSvg from "../../../svgs/StarSvg";
import "./RatingStyle.css";

const Rating = () => {
  const [rating, setRating] = useState(0); // Tracks selected rating

  return (
    <div className="rating-container">
      <div className="rating-svgs">
        {Array(5)
          .fill("")
          .map((_, index) => (
            <div key={index} onClick={() => setRating(index + 1)}>
              <StarSvg fill={index < rating ? "#69B5F8" : "#D9D9D9"} />
            </div>
          ))}
      </div>
      <div className="rating-value">
        Star Count: <span>{rating}</span>
      </div>
    </div>
  );
};

export default Rating;
