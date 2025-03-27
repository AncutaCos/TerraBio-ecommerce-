import { useEffect, useState, useRef } from "react";
import "./ReviewsSection.css";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const data = await response.json();
          console.log("Recensioni ricevute:", data); // Debug
          const approvedReviews = data.filter(review => review.approved);
          console.log("Recensioni approvate:", approvedReviews); // Debug
          setReviews(approvedReviews);
        } else {
          console.error("Errore nel recupero delle recensioni");
        }
      } catch (error) {
        console.error("Errore nella connessione all'API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) return <p>Caricamento recensioni...</p>;
  if (reviews.length === 0) return <p>Nessuna recensione disponibile.</p>;

  return (
    <section className="reviews-section">
      <h2>Recensioni dei nostri clienti</h2>

      <div className="reviews-wrapper">
        <button className="scroll-btn left" onClick={scrollLeft}>{"<"}</button>
        <div className="reviews-container" ref={scrollContainerRef}>
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <h4>{review.name}</h4>
              <p className="stars">{"⭐".repeat(review.rating)}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={scrollRight}>{">"}</button>
      </div>
    </section>
  );
};

export default ReviewsSection;