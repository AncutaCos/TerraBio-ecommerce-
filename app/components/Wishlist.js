// components/Wishlist.jsx
import "./Wishlist.css";

const Wishlist = ({ wishlistItems, onRemove }) => {
  return (
    <div className="wishlist">
      <h2>Lista Desideri</h2>

      {wishlistItems.length === 0 ? (
        <p>Nessun prodotto salvato.</p>
      ) : (
        <ul className="wishlist-items">
          {wishlistItems.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span>€{item.price.toFixed(2)}</span>
              <button onClick={() => onRemove(item.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
