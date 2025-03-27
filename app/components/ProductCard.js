import Image from "next/image";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={200}
          />
        ) : (
          <div className="no-image">Nessuna immagine</div>
        )}
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">
        {product.shortDescription || "Nessuna descrizione disponibile"}
      </p>
      <div className="product-footer">
        <span className="product-price">
          €{product.price ? product.price.toFixed(2) : "N/D"}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
