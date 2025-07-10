import corn from "node-cron";
import {
  walletService,
  transactionService,
  userService,
} from "../dependencyInjector";

corn.schedule("* * * * *", async () => {
  try {
    console.info("[⏱️ Cron]: Checking for expired on_process transactions");

    const admin = await userService.getAdmin();

    const transactions =
      await transactionService.updateOnProcessPurchaseTransactions();

    transactions.forEach(async (transaction) => {
      const trainerRevenueAmount =
        transaction.amount - transaction.adminCommission!;

      await walletService.creditWallet(
        String(transaction.receiverId),
        trainerRevenueAmount
      );

      await walletService.creditWallet(admin?.id, transaction.adminCommission!);
    });

    console.info(
      `[📦 Cron] complete — ${transactions.length} transaction(s) finalized`
    );
  } catch (err) {
    console.log(err);
  }
});
