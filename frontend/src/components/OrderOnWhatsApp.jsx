import { FaWhatsapp } from "react-icons/fa";

const OrderOnWhatsApp = ({ product }) => {
  const phoneNumber = "923104082056";

  const message = `Hi! I want to order this laptop from LapHub.pk:
  
Product: ${product.title}
Price: Rs ${Number(product?.price)?.toLocaleString() || "N/A"}
Link: ${window.location.href}

Please confirm:
- Availability:
- Delivery time:
- Best price:`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 text-lg"
    >
      <FaWhatsapp size={24} />
      Order on WhatsApp
    </a>
  );
};

export default OrderOnWhatsApp;
