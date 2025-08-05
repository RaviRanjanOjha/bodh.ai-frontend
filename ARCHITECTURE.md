# Frontend Modular Architecture Documentation

## Overview

This document outlines the modular, industry-standard architecture implemented for the BodhAI Frontend application. The architecture follows React best practices, separation of concerns, and maintainable code principles.

## Architecture Overview

```
src/
├── components/           # Reusable UI components
│   ├── errorBoundary/   # Error handling
│   ├── enhancedChat/    # Example modular component
│   ├── main/            # Main chat interface
│   ├── sidebar/         # Navigation sidebar
│   └── ...
├── contexts/            # React Context providers
│   ├── ChatContext.jsx      # Chat state management
│   ├── HistoryContext.jsx   # Conversation history
│   ├── UploadContext.jsx    # File upload handling
│   ├── AppProviders.jsx     # Combined providers
│   └── index.js             # Export barrel
├── hooks/               # Custom React hooks
│   ├── useChat.js           # Chat functionality
│   ├── useChatContext.js    # Chat context hook
│   ├── useHistoryContext.js # History context hook
│   ├── useUploadContext.js  # Upload context hook
│   ├── useStorage.js        # LocalStorage utilities
│   ├── useUrlNavigation.js  # URL/routing utilities
│   ├── useVoiceInput.js     # Voice input handling
│   └── index.js             # Export barrel
├── utils/               # Utility functions
│   ├── chatUtils.js         # Chat-specific utilities
│   ├── dateUtils.js         # Date/time formatting
│   ├── stringUtils.js       # String manipulation
│   ├── validationUtils.js   # Form validation
│   ├── urlUtils.js          # URL manipulation
│   ├── storageUtils.js      # Storage utilities
│   └── index.js             # Export barrel
├── constants/           # Application constants
│   └── index.js             # API config, UI config, etc.
├── types/               # Type definitions
│   └── propTypes.js         # PropTypes definitions
├── services/            # API services
│   └── api.js               # API calls
└── context/             # Legacy context (backward compatibility)
    └── Context.jsx          # Original context for compatibility
```

## Key Features

### 1. Modular Context Architecture

The application state is split into focused contexts:

- **ChatContext**: Manages chat state, message sending, session management
- **HistoryContext**: Handles conversation history and search functionality
- **UploadContext**: Manages file upload state and operations

```jsx
// Usage example
import { useChatContext, useHistoryContext } from "../hooks";

const MyComponent = () => {
  const { sendMessage, loading } = useChatContext();
  const { history, searchConversations } = useHistoryContext();
  // ...
};
```

### 2. Custom Hooks

Reusable hooks for common functionality:

```jsx
// Chat operations
const { sendMessage, startNewChat, stopResponse } = useChatContext();

// Storage operations
const [theme, setTheme] = useLocalStorage("app_theme", "light");

// URL navigation
const { navigateToSession, currentSessionId } = useUrlNavigation();

// Voice input
const { startListening, isListening } = useVoiceInput();
```

### 3. Utility Functions

Comprehensive utility library:

```jsx
import {
  formatTime,
  sanitizeInput,
  scrollToBottom,
  validateFile,
} from "../utils";

// Date formatting
const timestamp = formatTime(new Date()); // "02:30 PM"

// Input sanitization
const clean = sanitizeInput(userInput);

// Chat utilities
scrollToBottom(chatContainer, true); // smooth scroll
```

### 4. Error Boundaries

Robust error handling at component boundaries:

```jsx
import ErrorBoundary from "../components/errorBoundary/ErrorBoundary";

<ErrorBoundary>
  <ChatComponent />
</ErrorBoundary>;
```

### 5. Type Safety

PropTypes validation for better development experience:

```jsx
import { ChatContextType, MessageType } from "../types/propTypes";

MyComponent.propTypes = {
  chatContext: ChatContextType.isRequired,
  messages: PropTypes.arrayOf(MessageType),
};
```

## Usage Examples

### Setting Up Providers

```jsx
// App.jsx
import AppProviders from "./contexts/AppProviders";

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<ChatInterface />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}
```

### Creating a Modular Component

```jsx
// components/MyComponent.jsx
import React from "react";
import PropTypes from "prop-types";
import { useChatContext } from "../hooks";
import { formatTime, sanitizeInput } from "../utils";
import { MESSAGE_TYPES } from "../constants";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

const MyComponent = ({ className = "", maxLength = 1000 }) => {
  const { sendMessage, loading } = useChatContext();

  const handleSubmit = async (text) => {
    const sanitized = sanitizeInput(text);
    if (sanitized.length <= maxLength) {
      await sendMessage(sanitized);
    }
  };

  return (
    <ErrorBoundary>
      <div className={`my-component ${className}`}>
        {/* Component content */}
      </div>
    </ErrorBoundary>
  );
};

MyComponent.propTypes = {
  className: PropTypes.string,
  maxLength: PropTypes.number,
};

export default MyComponent;
```

## Benefits

### 1. **Separation of Concerns**

- Each context handles a specific domain
- Utility functions are focused and reusable
- Components have single responsibilities

### 2. **Reusability**

- Hooks can be shared across components
- Utility functions prevent code duplication
- Components are composable and configurable

### 3. **Maintainability**

- Clear file structure and naming conventions
- Consistent patterns across the codebase
- Easy to locate and modify functionality

### 4. **Testability**

- Isolated functions and hooks are easy to test
- Mocked contexts for component testing
- Pure utility functions for unit testing

### 5. **Performance**

- React.memo for component optimization
- Selective context subscriptions
- Efficient re-rendering patterns

### 6. **Developer Experience**

- PropTypes for runtime type checking
- Comprehensive error boundaries
- Detailed console logging and debugging

### 7. **Accessibility**

- Keyboard navigation support
- Screen reader compatibility
- ARIA attributes where needed

### 8. **Responsive Design**

- Mobile-first approach
- Flexible layouts
- Touch-friendly interfaces

## Migration Guide

### From Legacy Context

Old way:

```jsx
import { useContext } from "react";
import { Context } from "../context/Context";

const { onSent, loading, resultData } = useContext(Context);
```

New way:

```jsx
import { useChatContext } from "../hooks";

const { sendMessage, loading, resultData } = useChatContext();
```

### Utility Functions

Old way:

```jsx
// Inline date formatting
const formatTime = (timestamp) => {
  // Complex formatting logic
};
```

New way:

```jsx
import { formatTime } from "../utils";

const formatted = formatTime(timestamp);
```

## Best Practices

### 1. **Component Design**

- Use functional components with hooks
- Implement PropTypes for all props
- Use React.memo for performance-critical components
- Wrap components in ErrorBoundary

### 2. **State Management**

- Use appropriate context for state domain
- Minimize context re-renders with careful state structure
- Use local state for component-specific data

### 3. **Error Handling**

- Implement error boundaries at appropriate levels
- Use try-catch for async operations
- Provide meaningful error messages

### 4. **Performance**

- Use useCallback and useMemo appropriately
- Implement code splitting where beneficial
- Optimize re-renders with proper dependencies

### 5. **Accessibility**

- Include ARIA labels and roles
- Ensure keyboard navigation
- Test with screen readers
- Maintain proper focus management

## Constants and Configuration

The application uses centralized configuration:

```jsx
// constants/index.js
export const API_CONFIG = {
  BASE_URL: "http://localhost:8000",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const UI_CONFIG = {
  TYPING_DELAY: 10,
  MAX_MESSAGE_LENGTH: 5000,
  DEBOUNCE_DELAY: 300,
};
```

## Future Enhancements

### 1. **TypeScript Migration**

- Convert PropTypes to TypeScript interfaces
- Add strict type checking
- Implement generic types for reusable components

### 2. **Testing Framework**

- Add Jest and React Testing Library
- Implement unit tests for utilities
- Add integration tests for components
- E2E testing with Cypress

### 3. **State Management**

- Consider Redux Toolkit for complex state
- Implement state persistence
- Add optimistic updates

### 4. **Performance Optimization**

- Implement virtual scrolling for long conversations
- Add service worker for offline functionality
- Optimize bundle size with tree shaking

### 5. **Advanced Features**

- Real-time collaboration
- Message encryption
- Advanced search with filters
- Voice message support

## Conclusion

This modular architecture provides a solid foundation for building maintainable, scalable React applications. It follows industry best practices while remaining flexible enough to accommodate future requirements and enhancements.

The structure promotes code reusability, testability, and developer productivity while ensuring a great user experience with proper error handling, accessibility, and performance optimization.
