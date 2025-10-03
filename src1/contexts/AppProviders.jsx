import React from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "../components/errorBoundary/ErrorBoundary";
import { ChatProvider } from "./ChatContext";
import { HistoryProvider } from "./HistoryContext";
import { UploadProvider } from "./UploadContext";

const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      <ChatProvider>
        <HistoryProvider>
          <UploadProvider>{children}</UploadProvider>
        </HistoryProvider>
      </ChatProvider>
    </ErrorBoundary>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
