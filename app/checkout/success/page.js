import { Suspense } from "react";
import CheckoutSuccessPage from "./CheckoutSuccessPage";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <CheckoutSuccessPage />
    </Suspense>
  );
}
