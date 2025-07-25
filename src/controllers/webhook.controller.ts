import e, { NextFunction, Request, Response } from "express";
import { IStreamService } from "../interfaces/services/IStream.service";
import binder from "../utils/binder";
import { receiver } from "../config/liveKit";
import stripe from "../config/stripe";
import envConfig from "../config/env";
import { IEnrolledCoursesService } from "../interfaces/services/IEnrolledCourses.service";
import { IChatService } from "../interfaces/services/IChat.service";
import { ISubscriptionService } from "../interfaces/services/ISubscription.service";
import { IWishlistService } from "../interfaces/services/IWishlist.service";
import { ILiveSessionService } from "../interfaces/services/ILiveSession.service";

/**
 * Handles third-party webhook events (LiveKit, Stripe) for real-time updates and automation.
 * All methods are bound for safe Express routing.
 */
class WebHookController {
  constructor(
    private streamService: IStreamService,
    private _enrolledCourseService: IEnrolledCoursesService,
    private _chatService: IChatService,
    private _subscriptionService: ISubscriptionService,
    private _wishlistService: IWishlistService,
    private _liveSessionService: ILiveSessionService
  ) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Handles LiveKit webhook events for stream lifecycle automation (e.g., auto-recording, cleanup).
   */
  public async liveKit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const authHeader = req.headers["authorization"] as string;

      const event = await receiver.receive(req.body, authHeader);
      console.log("✅ Webhook event:", event.event, event.room?.name);

      if (event.participant?.name !== "host") {
        return res.status(400).json({
          message: "Webhook received successfully",
        });
      }

      switch (event.event) {
        case "participant_joined":
          console.log("⏳ Waiting 1s before starting recording...");
          await new Promise((res) => setTimeout(res, 1000));
          // await this.streamService.startRecording(event.room?.name!);
          await this._liveSessionService.startRecording(event.room?.name!);
          break;
        case "participant_left":
          // await this.streamService.endStream(event.room?.name!);
          await this._liveSessionService.endLiveSession(event.room?.name!);

          break;
      }

      res.status(200).json({
        message: "Webhook received successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles Stripe webhook events for purchase, subscription, and payment status updates.
   * Ensures user/course state is updated in response to payment events.
   */
  public async stripe(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.get("stripe-signature")!;

      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        envConfig.STRIPE_WEBHOOK_SECRET // ✅ Correct secret
      );

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const { userId, courseId, transactionId, planId } = session.metadata!;
          if (courseId) {
            await this._enrolledCourseService.completePurchase(
              userId,
              courseId,
              transactionId
            );
            await this._chatService.joinChat(userId, courseId);
            await this._wishlistService.removeCourseFromWishlist(
              userId,
              courseId
            );
          }

          if (planId) {
            await this._subscriptionService.completeSubscription(
              userId,
              planId,
              transactionId
            );
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (err) {
      next(err);
    }
  }
}

export default WebHookController;
