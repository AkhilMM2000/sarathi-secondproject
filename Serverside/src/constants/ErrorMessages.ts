export const ERROR_MESSAGES = {
    // General
    UNKNOWN_ERROR: "Something went wrong. Please try again.",
    INVALID_INPUT: "Invalid input provided.",
    FORBIDDEN: "You are not authorized to perform this action.",
    NOT_FOUND: "Requested resource not found.",
    INTERNAL_SERVER_ERROR: "Internal server error.",
    
    // Authentication / Authorization
    AUTH_FAILED: "Authentication failed.",
    INVALID_TOKEN: "Invalid or expired token.",
    ACCESS_DENIED: "Access denied.",
    SESSION_EXPIRED: "Session expired. Please login again.",
  
    // User
    USER_NOT_FOUND: "User not found.",
    USER_ID_NOT_FOUND: "User ID not found.",
    USER_ALREADY_EXISTS: "User already exists.",
    EMAIL_ALREADY_REGISTERED: "Email is already registered.",
    MOBILE_ALREADY_REGISTERED: "Mobile number is already registered.",
    OTP_EXPIRED: "OTP has expired.",
    OTP_INVALID: "Invalid OTP provided.",
    ACCOUNT_NOT_VERIFIED: "Account not verified. Please verify first.",
  
    // Driver
    DRIVER_NOT_FOUND: "Driver not found.",
    DRIVER_ID_NOT_FOUND: "Driver ID not found.",
    DRIVER_ALREADY_EXISTS: "Driver already registered.",
    DRIVER_PENDING_APPROVAL: "Driver account is pending admin approval.",
    DRIVER_REJECTED: "Driver application was rejected by admin.",
    DRIVER_NOT_AVAILABLE: "Driver is not available at the moment.",
  
    // Wallet
    WALLET_NOT_FOUND: "Wallet not found.",
    WALLET_ALREADY_EXISTS: "Wallet already exists for this user.",
    INSUFFICIENT_BALANCE: "Insufficient wallet balance.",
    WALLET_TRANSACTION_FAILED: "Wallet transaction failed.",
  
    // Booking
    BOOKING_NOT_FOUND: "Booking not found.",
    BOOKING_ALREADY_COMPLETED: "Booking has already been completed.",
    NO_AVAILABLE_DRIVERS: "No drivers available near your location.",
    BOOKING_CANCELLATION_FAILED: "Booking cancellation failed.",
    INVALID_BOOKING_STATUS: "Invalid booking status for this action.",
  
    // Payments
    PAYMENT_FAILED: "Payment failed.",
    INVALID_PAYMENT_DETAILS: "Invalid payment details provided.",
    REFUND_FAILED: "Refund processing failed.",
  
    // Admin
    ADMIN_NOT_FOUND: "Admin not found.",
    UNAUTHORIZED_ADMIN_ACTION: "You are not authorized to perform this admin action.",
  
    // Location / Map
    LOCATION_NOT_FOUND: "Location not found.",
    INVALID_LOCATION: "Invalid location provided.",
    DISTANCE_CALCULATION_FAILED: "Failed to calculate distance.",
  
    // Notifications
    NOTIFICATION_FAILED: "Failed to send notification.",
  
    // Files / Uploads
    FILE_UPLOAD_FAILED: "File upload failed.",
    INVALID_FILE_TYPE: "Invalid file type uploaded.",
    FILE_TOO_LARGE: "Uploaded file is too large.",
  
    // Rate Limiting / Abuse Protection
    TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
  
    // External Services
    EXTERNAL_SERVICE_UNAVAILABLE: "External service is currently unavailable.",
  };
  