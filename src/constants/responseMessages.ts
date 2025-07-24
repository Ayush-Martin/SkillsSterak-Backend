/**
 * General success messages for API responses
 */
export enum GeneralMessage {
  // Success messages
  DataReturned = "Data returned",
}

/**
 * Authentication and authorization related messages
 */
export enum AuthMessage {
  // Error messages
  EmailExists = "User with email already exists",
  OtpExpired = "OTP is expired",
  InvalidOtp = "Invalid OTP",
  OtpNotVerified = "OTP is not verified",
  InvalidCredentials = "Invalid credentials",
  UserBlocked = "Blocked",
  InvalidRefreshToken = "Invalid refresh token",
  InvalidAccessToken = "Invalid token",
  NoAccess = "You have no access",
  InvalidCurrentPassword = "Current password is invalid",

  // Success messages
  OTPResent = "OTP resent",
  RegisterOtpSent = "OTP sent to your email, verify to complete registration",
  UserRegistered = "New user created",
  UserLoggedIn = "Login successful",
  UserLoggedOut = "User is logged out",
  ForgetPasswordOtpSent = "OTP sent to your email, verify to reset password",
  OtpVerified = "OTP is verified",
  PasswordReset = "Password is updated",
  TokenRefreshed = "Token refreshed",
}

/**
 * User profile and account related messages
 */
export enum UserMessage {
  // Error messages
  UserNotFound = "User not found",
  NoProfileImage = "Profile image is not given",

  // Success messages
  ProfileImageUpdated = "Profile image is updated",
  ProfileUpdated = "Profile updated",
  UserBlocked = "User blocked",
  UserUnblocked = "User unblocked",
}

/**
 * Category management related messages
 */
export enum CategoryMessage {
  // Error messages
  CategoryExists = "Category already exists",
  CategoryNotFound = "Category not found",

  // Success messages
  CategoryAdded = "New category created",
  CategoryUpdated = "Category updated",
  CategoryListed = "Category has been listed",
  CategoryUnlisted = "Category has been unlisted",
}

/**
 * Course management and enrollment related messages
 */
export enum CourseMessage {
  // Error messages
  CourseExists = "Course with the same title already exists",
  CourseNotFound = "Course not found",
  NoCourseAccess = "You have no access to this course",
  CourseNoThumbnail = "Course thumbnail not added",

  // Success messages
  CourseCreated = "New course created",
  ThumbnailUpdated = "Course thumbnail changed",
  BasicDetailsUpdated = "Basic details updated",
  RequirementsUpdated = "Course requirements updated",
  SkillsCoveredUpdated = "Course skills covered updated",
  CourseEnrolled = "Course enrolled",
  CourseOrderCreated = "Order created",
  CourseAccessGranted = "Course access granted",
  CourseListed = "Course has been listed",
  CourseUnlisted = "Course has been unlisted",
  CourseApproved = "Course has been approved",
  CourseRejected = "Course has been rejected",
}

/**
 * Module management related messages
 */
export enum ModuleMessage {
  // Success messages
  ModuleAdded = "New module added",
  ModuleDeleted = "Module deleted",
  ModuleTitleChanged = "Module title changed",
}

/**
 * Lesson management and file upload related messages
 */
export enum LessonMessage {
  // Error messages
  NoFile = "File is required",

  // Success messages
  LessonDetailsUpdated = "Lesson details updated",
  LessonFileUpdated = "Lesson file has been updated",
  LessonCompleted = "Lesson completed",
  LessonNotCompleted = "Lesson not completed",
  LessonAdded = "New lesson added",
  LessonDeleted = "Lesson deleted",
}

/**
 * Subscription and access control related messages
 */
export enum SubscriptionMessage {
  // Error messages
  NotSubscribed = "You are not subscribed",
  SubscriptionExpired = "Subscription has expired",

  // Success messages
  SubscriptionAdded = "Subscription added",
}

/**
 * Review and reply related messages
 */
export enum ReviewMessage {
  //Error messages
  ReviewedAlready = "Already reviewed cannot review",
  NotEnrolledCourse = "You must enroll the course to add review",

  // Success messages
  ReviewAdded = "Review has been added",
  ReviewDeleted = "Review has been deleted",
  ReplyAdded = "Reply has been added",
  ReviewUpdated = "Review has been updated",
}

/**
 * Trainer request and approval related messages
 */
export enum TrainerRequestMessage {
  // Success messages
  TrainerRequestSent = "Trainer request has been sent",
  RequestApproved = "Request has been approved",
  RequestRejected = "Request has been rejected",
}

/**
 * Chat response messages
 */
export enum ChatMessage {
  //Success messages
  MediaSent = "Media Sent",
  NewChat = "New chat created",
}

/**
 * Notebook management response messages
 */
export enum NotebookMessage {
  //Success messages
  NotebookAdded = "Note book added",
  NotebookDeleted = "Note book deleted",
  NotebookUpdated = "Note book updated",
}

/**
 * Wallet management response messages
 */
export enum WalletMessage {
  //Success messages
  Redeemed = "Redeemed",
  NoStripeAccount = "Stripe account not setup for user",
  NoEnoughBalance = "Cannot redeem not enough ballance",
}

/**
 * Wishlist management response messages
 */
export enum WishlistMessage {
  //Success messages
  courseAdded = "Course added to wishlist",
  courseRemoved = "Course removed to wishlist",
}

/**
 * Live Stream management response messages
 */
export enum LiveStreamMessage {
  //Success messages
  RecordingNotFound = "Recording not found",
  StreamNotFound = "Stream not found",
}

export enum AssignmentMessage {
  //Success messages
  AssignmentAdded = "Assignment added",
  AssignmentDeleted = "Assignment deleted",
  AssignmentUpdated = "Assignment updated",
  AssignmentSubmitted = "Assignment submitted",
  AssignmentGraded = "Assignment graded",
  AssignmentUngraded = "Assignment ungraded",
  AssignmentReSubmitted = "Assignment resubmitted",
}

export enum LiveSessionMessage {
  //Success messages
  LiveSessionScheduled = "Live session scheduled",
  LiveSessionUpdated = "Live session updated",
  LiveSessionDeleted = "Live session deleted",
  LiveSessionStarted = "Live session started",
}

export enum DiscussionMessage {
  //Success messages
  DiscussionAdded = "Discussion added",
  DiscussionDeleted = "Discussion deleted",
  DiscussionUpdated = "Discussion updated",
  ReplyAdded = "Reply has been added",
}

export enum SubscriptionPlanMessage {
  //Success messages
  SubscriptionPlanAdded = "Subscription plan added",
  SubscriptionPlanUpdated = "Subscription plan updated",
  SubscriptionListed = "Subscription plan listed",
  SubscriptionUnlisted = "Subscription plan unlisted",
}
