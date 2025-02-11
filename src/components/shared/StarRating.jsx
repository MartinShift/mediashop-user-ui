const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(
                <small key={i} className="fa fa-star text-primary mr-1"></small>
            );
        } else if (i === fullStars && hasHalfStar) {
            stars.push(
                <small key={i} className="fa fa-star-half-alt text-primary mr-1"></small>
            );
        } else {
            stars.push(
                <small key={i} className="far fa-star text-primary mr-1"></small>
            );
        }
    }

    return <div className="text-primary mb-2">{stars}</div>;
};

export default StarRating;