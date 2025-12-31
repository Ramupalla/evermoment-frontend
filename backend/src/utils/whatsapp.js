// export const sendWhatsAppMessage = async (number, link) => {
//   console.log(`📱 WhatsApp message would be sent to ${number}`);
//   console.log(`🔗 Link: ${link}`);
// };

export async function sendReadyForPaymentWhatsApp({ phone, orderId, link }) {
  console.log("📱 WHATSAPP → Ready for Payment");
  console.log({ phone, orderId, link });
}
