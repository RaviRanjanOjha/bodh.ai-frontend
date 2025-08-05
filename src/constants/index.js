export const API_CONFIG = {
  BASE_URL: "https://localhost:8000",
  ENDPOINTS: {
    CHAT: "/chat",
    CHAT_STREAM: "/chat/stream",
    CHAT_HISTORY: "/chat/history",
    CHAT_SEARCH: "/chat/search",
    CHAT_STOP: "/chat/stop",
    CHAT_DELETE: "/chat",
    VOICE_INPUT: "/chat/voice-input",
    CLIENTS: "/clients",
    DOCUMENTS: "/documents",
    UPLOAD: "/documents/upload",
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const UI_CONFIG = {
  TYPING_DELAY: 10,
  STREAM_DELAY: 10,
  AUTO_SCROLL_DELAY: 100,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
  MAX_MESSAGE_LENGTH: 5000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const CHAT_CONFIG = {
  MAX_HISTORY_ITEMS: 100,
  SEARCH_LIMIT: 10,
  SESSION_STORAGE_KEY: "chat_session_id",
  CONVERSATION_REFRESH_DELAY: 100,
};

export const MESSAGE_TYPES = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
};

export const UPLOAD_STATUS = {
  IDLE: null,
  UPLOADING: "uploading",
  UPLOADED: "uploaded",
  ERROR: "error",
};

export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  STREAMING: "streaming",
  ERROR: "error",
  SUCCESS: "success",
};

// export const DEFAULT_CARD_DATA = [
//    { title: "Our Capabilities", desc: "A brief idea on what we do" , iconLeft: <FrontHandIcon/>,iconRight : <OutboundOutlinedIcon/>},
//     { title: "Available Languages", desc: "What languages can we chat in?",iconLeft: <GTranslateIcon/>,iconRight : <OutboundOutlinedIcon/> },
//     {
//       title: "Clients We Work With",
//       desc: "Our list of elite clients across the globe",iconLeft: <ChatIcon/>,iconRight : <OutboundOutlinedIcon/>
//     },
//     {title: (<>Advisor <br /> Chat Guide</>),desc: "How to chat with an advisor?", iconLeft: <AccountCircleIcon />, iconRight: <OutboundOutlinedIcon />}
// ];

export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Network connection failed. Please check your internet connection.",
  SESSION_EXPIRED: "Your session has expired. Please refresh the page.",
  UPLOAD_FAILED: "File upload failed. Please try again.",
  INVALID_FILE_TYPE:
    "Unsupported file type. Please upload PDF, DOC, or TXT files.",
  FILE_TOO_LARGE: "File is too large. Maximum size allowed is 10MB.",
  CONVERSATION_NOT_FOUND: "Conversation not found.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
};

export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS:
    "Documents uploaded successfully! You can now ask questions about the uploaded documents.",
  CONVERSATION_SAVED: "Conversation saved successfully.",
  MESSAGE_SENT: "Message sent successfully.",
};
