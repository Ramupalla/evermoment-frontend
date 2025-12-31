export function getDeliveryEstimate(plan, fastTrack = false) {
  let daysToAdd = 1;

  if (plan === "story") {
    daysToAdd = fastTrack ? 1 : 1;
  } else if (plan === "basic") {
    daysToAdd = 4;
  } else if (plan === "premium") {
    daysToAdd = 6;
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

  const day = deliveryDate.toLocaleDateString("en-IN", { weekday: "long" });
  const date = deliveryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    date,
    day,
  };
}
