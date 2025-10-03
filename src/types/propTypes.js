/**
 * PropTypes definitions for components
 */
import PropTypes from "prop-types";

// Basic prop types
export const StringType = PropTypes.string;
export const NumberType = PropTypes.number;
export const BooleanType = PropTypes.bool;
export const FunctionType = PropTypes.func;
export const ObjectType = PropTypes.object;
export const ArrayType = PropTypes.array;
export const NodeType = PropTypes.node;
export const ElementType = PropTypes.element;

// Custom prop types
export const SessionIdType = PropTypes.string;
export const TimestampType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.instanceOf(Date),
  PropTypes.number,
]);

export const MessageType = PropTypes.shape({
  id: PropTypes.string,
  role: PropTypes.oneOf(["user", "assistant", "system"]),
  content: PropTypes.string.isRequired,
  timestamp: TimestampType,
});

export const ConversationType = PropTypes.shape({
  session_id: PropTypes.string.isRequired,
  summary: PropTypes.string,
  timestamp: TimestampType,
  messages: PropTypes.arrayOf(MessageType),
});

export const UploadStatusType = PropTypes.oneOf([
  null,
  "uploading",
  "uploaded",
  "error",
]);

export const LoadingStateType = PropTypes.oneOf([
  "idle",
  "loading",
  "streaming",
  "error",
  "success",
]);

export const ChatContextType = PropTypes.shape({
  input: StringType,
  setInput: FunctionType,
  recentPrompt: StringType,
  prevPrompts: ArrayType,
  showResults: BooleanType,
  loading: BooleanType,
  resultData: StringType,
  currentSessionId: SessionIdType,
  isStreaming: BooleanType,
  onSent: FunctionType,
  stopResponse: FunctionType,
  newChat: FunctionType,
});

export const HistoryContextType = PropTypes.shape({
  history: PropTypes.arrayOf(ConversationType),
  selectedConversation: ConversationType,
  historyLoading: BooleanType,
  historyError: StringType,
  searchQuery: StringType,
  searchResults: ArrayType,
  searchLoading: BooleanType,
  searchError: StringType,
  fetchHistory: FunctionType,
  fetchConversationDetails: FunctionType,
  searchConversations: FunctionType,
});

export const UploadContextType = PropTypes.shape({
  uploadStatus: UploadStatusType,
  uploadError: StringType,
  uploadedFiles: ArrayType,
  uploadProgress: NumberType,
  onUploadDocument: FunctionType,
  clearUploadState: FunctionType,
});

// Common component prop types
export const ButtonProps = {
  children: NodeType.isRequired,
  onClick: FunctionType,
  disabled: BooleanType,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "outline"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: StringType,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export const InputProps = {
  value: StringType,
  onChange: FunctionType,
  placeholder: StringType,
  disabled: BooleanType,
  error: StringType,
  className: StringType,
  type: PropTypes.oneOf(["text", "email", "password", "search", "number"]),
  required: BooleanType,
  maxLength: NumberType,
};

export const CardProps = {
  title: StringType.isRequired,
  desc: StringType,
  onClick: FunctionType,
  className: StringType,
  children: NodeType,
};

export const ModalProps = {
  isOpen: BooleanType.isRequired,
  onClose: FunctionType.isRequired,
  title: StringType,
  children: NodeType.isRequired,
  className: StringType,
  overlayClassName: StringType,
  closeOnEscape: BooleanType,
  closeOnOverlayClick: BooleanType,
};

// Validation helpers
export const requiredString = StringType.isRequired;
export const requiredFunction = FunctionType.isRequired;
export const requiredBoolean = BooleanType.isRequired;
export const requiredNumber = NumberType.isRequired;
export const requiredArray = ArrayType.isRequired;
export const requiredObject = ObjectType.isRequired;
export const requiredNode = NodeType.isRequired;
