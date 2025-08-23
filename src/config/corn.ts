import cron from "node-cron";
import {
  walletService,
  transactionService,
  userService,
} from "../dependencyInjector";

let isRunning = false;
const CRON_SCHEDULE = "* * * * *";

/**
 * Scheduled job that runs based on `CRON_SCHEDULE`.
 *
 * Responsibilities:
 * 1. Finds `on_process` course purchase transactions whose cancellation time has expired and marks them as `completed`.
 * 2. Processes all newly completed transactions.
 * 3. Splits each transaction's amount between the admin and the trainer, crediting their wallets.
 * 4. Creates a transaction record for the admin's commission.
 *
 * Concurrency safeguard: skips execution if a previous run is still in progress.
 *
 * Logs summary info including number of transactions finalized and execution duration.
 */
cron.schedule(CRON_SCHEDULE, async () => {
  if (isRunning) {
    console.warn("[Cron Skipped]: Previous execution still in progress.");
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    console.info("[Cron]: Checking for expired on_process transactions");

    const admin = await userService.getAdmin(); // Admin details used to credit commission

    const transactions =
      await transactionService.updateOnProcessPurchaseTransactions();

    await Promise.all(
      transactions.map(async (transaction) => {
        const trainerRevenueAmount =
          transaction.amount - transaction.adminCommission!;

        // Credit trainer's wallet
        await walletService.creditWallet(
          String(transaction.receiverId),
          trainerRevenueAmount
        );

        // Credit admin's wallet
        await walletService.creditWallet(
          admin?.id,
          transaction.adminCommission!
        );

        // Record admin commission transaction
        await transactionService.createTransaction({
          payerId: transaction.receiverId,
          amount: transaction.adminCommission!,
          type: "commission",
          status: "completed",
        });
      })
    );

    console.info(
      `[Cron]: Completed — ${transactions.length} transaction(s) finalized in ${
        Date.now() - startTime
      }ms`
    );
  } catch (err) {
    console.error("[Cron Error]:", err);
  } finally {
    isRunning = false;
  }
});
