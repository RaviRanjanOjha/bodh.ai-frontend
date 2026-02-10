import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import {
  LogoSection,
  PromptSection,
  InputSection,
  SkeletonLoader,
} from "./index";
import { Context } from "../../context/Context";
import { scrollToBottom, updateUrlWithSession } from "../../utils";
import { useIsMobile } from "../../hooks/useIsMobile";
import useSideNavStore from "../../store/useSideNavStore";

const DashboardContent = () => {
  const {
    onSent,
    showResults,
    loading,
    resultData,
    setInput,
    input,
    stopResponse,
    uploadStatus,
    uploadError,
    currentSessionId,
    showSkeleton,
  } = useContext(Context);

  const chatContainerRef = useRef(null);
  const [inputFocus, setInputFocus] = useState(false);
  const isMobileView = useIsMobile();
  const { isNavigationCollapsed, setToggleNavigation } = useSideNavStore();

  function inputResize(e) {
    setInput(e.target.value);

    // e.target.style.height = 'auto';
    // e.target.style.height = e.target.scrollHeight + "px";
  }
  
  useLayoutEffect(() => {
    if (chatContainerRef.current && resultData && loading === false) {
      scrollToBottom(chatContainerRef.current, true);
    }
  }, [resultData, loading]);

  // Sync URL with current session - using utility
  useEffect(() => {
    if (currentSessionId) {
      updateUrlWithSession(currentSessionId);
    } else if (window.location.search) {
      // Clean URL if no session but one exists in URL
      updateUrlWithSession(null);
    }
  }, [currentSessionId]);

  // Wrapper for onSent that includes auto-scroll
  const handleSendMessage = async () => {
    // Trigger the original onSent function
    await onSent();

    // Immediately scroll to bottom to show user's message
    if (chatContainerRef.current) {
      setTimeout(() => {
        scrollToBottom(chatContainerRef.current, true);
      }, 50);
    }
  };

  return (
    <div
      className="flex items-center align-middle flex-col bodh-logo sm:h-[90vh] h-[92vh] pb-3 sm:pb-5 relative"
      onClick={() => {
        isMobileView && !isNavigationCollapsed && setToggleNavigation();
      }}
    >
      {!showResults && !uploadStatus && !showSkeleton ? (
        <LogoSection />
      ) : (
        <div
          className={`flex flex-col w-[95%] sm:w-[65%] overflow-hidden transition-all duration-300 ease-in-out h-auto py-2 sm:py-4`}
          ref={chatContainerRef}
        >
          {(uploadStatus || uploadError) && !resultData && (
            <div className="conversation-thread">
              <div className="message-row assistant-row">
                <div className="message-bubble assistant-bubble">
                  <div className="message-content">
                    <div className="message-text">
                      {uploadStatus === "uploading" && "Uploading documents..."}
                      {uploadStatus === "uploaded" &&
                        "Documents uploaded successfully! You can now ask questions about the uploaded documents."}
                      {uploadError && `Upload error: ${uploadError} `}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showSkeleton ? (
            <SkeletonLoader />
          ) : (
            <>
              {resultData && (
                <PromptSection loading={loading} resultData={resultData} />
              )}
            </>
          )}
        </div>
      )}
      <div
        className={` w-full flex justify-center 
            ${isMobileView && !isNavigationCollapsed && "pointer-events-none"}
            ${
              showResults || uploadStatus
                ? "items-end h-auto"
                : "items-center h-100"
            } 
            ${uploadStatus === "uploading" && "items-end h-full"}
            ${showSkeleton && "absolute bottom-5 h-auto"}`}
      >
        <InputSection
          value={input}
          onChange={inputResize}
          onSend={() => handleSendMessage()}
          disabled={false}
          onStop={stopResponse}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          inputFocus={inputFocus}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
