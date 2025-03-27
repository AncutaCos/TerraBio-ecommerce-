import { CartProvider } from "./context/CartContext";
import CartModal from "./components/CartModal";
import { WishlistProvider } from "./context/WishContext";
import { AuthProvider } from "./context/AuthContext";
import CookieBanner from "./components/CookieBanner"; // Importa il componente client-side

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <CartModal />
              <CookieBanner /> {/* Usa il componente client-side */}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}