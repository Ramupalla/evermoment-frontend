// if (order.payment_status !== "paid") {
//   return res.status(403).json({
//     error: "Payment required to download final video"
//   });
// }

if (order.payment_status !== "paid") {
  return res.status(403).json({
    error: "Payment required to download final video",
  });
}
