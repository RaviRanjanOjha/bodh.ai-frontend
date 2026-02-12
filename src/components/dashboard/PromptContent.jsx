import { assets } from "../../assets/assets";
import SkeletonLoader from "./SkeletonLoader";
import ReactMarkdown from "react-markdown";
import "./Dashboard.css";
import { useState } from "react";

const PromptContent = ({
  loading,
  message,
  normalizeMessage,
  messageType,
  index,
  messages,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const isImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    const isUrl = url.startsWith("http://") || url.startsWith("https://");
    return (
      isUrl &&
      (imageExtensions.test(url) || url.includes("blob.core.windows.net"))
    );
  };

  const isExcelUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    return url.endsWith(".xlsx");
  };

  let imageLink = null;
  let excelLink = null;
  if (message.content && typeof message.content === "string") {
    if (message.content.includes("|")) {
      const [first, second] = message.content.split("|").map((s) => s.trim());
      if (isImageUrl(first)) imageLink = first;
      if (isExcelUrl(second)) excelLink = second;
    } else {
      const val = message.content.trim();
      if (isImageUrl(val)) imageLink = val;
      else if (isExcelUrl(val)) excelLink = val;
    }
  }

  if (messageType === "assistant") {
    return (
      <div className="relative flex flex-row-reverse items-start gap-2">
        <div className="flex-shrink-0 overflow-hidden">
          <img
            src={assets.ai_stars}
            alt="Prompt Heading"
            className="h-[28px] scale-[2.5] object-cover object-center"
          />
        </div>

        <div className="flex flex-col items-end w-full bg-gray-100 rounded-2xl">
          {loading && index === messages.length - 1 ? (
            <SkeletonLoader isNewChat={true} />
          ) : (
            <div className="space-y-4">
              {imageLink && excelLink ? (
                <div
                  className={`${
                    isZoomed
                      ? "fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm bg-black/10"
                      : "relative w-full overflow-auto "
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={imageLink}
                    alt="Generated Image"
                    className={`${
                      isZoomed
                        ? "max-w-[99vw] max-h-[95vh] object-contain cursor-zoom-out transition-transform duration-300 shadow-md"
                        : "w-full h-auto cursor-zoom-in"
                    }`}
                  />
                </div>
              ) : imageLink ? (
                <div
                  className={`${
                    isZoomed
                      ? "fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm bg-black/10"
                      : "relative w-full sm:w-[70%] overflow-auto ml-auto rounded-xl"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={imageLink}
                    alt="Generated Image"
                    className={`${
                      isZoomed
                        ? "max-w-[95vw] max-h-[95vh] object-contain cursor-zoom-out transition-transform duration-300 shadow-md"
                        : "w-full h-auto cursor-zoom-in"
                    }`}
                  />
                </div>
              ) : (
                <ReactMarkdown>
                  {normalizeMessage(message.content)}
                </ReactMarkdown>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } else return <></>;
};

export default PromptContent;
