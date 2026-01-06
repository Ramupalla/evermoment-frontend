import cron from "node-cron";
import { cleanupDeliveredOrders } from "./jobs/cleanupDeliveredOrders.js";

cron.schedule("0 2 * * *", async () => {
  console.log("🧹 Running S3 cleanup job...");
  await cleanupDeliveredOrders();
});
