import cron from "node-cron";
import {
  walletService,
  transactionService,
  userService,
} from "../dependencyInjector";

let isRunning = false;

cron.schedule("* * * * *", async () => {
  if (isRunning) {
    console.warn("[⏳ Cron Skipped]: Previous execution still in progress.");
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    console.info("[⏱️ Cron]: Checking for expired on_process transactions");

    const admin = await userService.getAdmin();

    const transactions =
      await transactionService.updateOnProcessPurchaseTransactions();

    await Promise.all(
      transactions.map(async (transaction) => {
        const trainerRevenueAmount =
          transaction.amount - transaction.adminCommission!;

        await walletService.creditWallet(
          String(transaction.receiverId),
          trainerRevenueAmount
        );

        await walletService.creditWallet(
          admin?.id,
          transaction.adminCommission!
        );

        await transactionService.createTransaction({
          payerId: transaction.receiverId,
          receiverId: admin?.id,
          amount: transaction.adminCommission!,
          type: "commission",
          status: "completed",
        });
      })
    );

    console.info(
      `[📦 Cron]: Completed — ${
        transactions.length
      } transaction(s) finalized in ${Date.now() - startTime}ms`
    );
  } catch (err) {
    console.error("[❌ Cron Error]:", err);
  } finally {
    isRunning = false;
  }
});
