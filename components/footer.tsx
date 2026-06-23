import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="brand brand--footer">
        Fuel<span>Bar</span>
      </div>
      <p>25% complete whey protein. Zero added refined sugar. Pan-India delivery.</p>
      <a
        className="button button--whatsapp"
        href="https://wa.me/916263099627?text=Hi%20FuelBar%2C%20I%20want%20to%20order%20protein%20bars."
        rel="noreferrer"
        target="_blank"
      >
        <MessageCircle size={18} />
        WhatsApp
      </a>
    </footer>
  );
}
