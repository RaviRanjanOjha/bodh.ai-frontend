import { assets } from "../../assets/assets";

const PromptHeader = ({ message, normalizeMessage, messageType }) => {
  if (messageType === "user") {
    return (
      <div className="flex items-start justify-start gap-2 w-full">
        
        <img src={assets.userIcon} alt="" className="h-[14px] sm:h-[20px] flex-shrink-0" />
        <div className="max-w-[70%]">
        <p className="break-words text-[#2e2e2e] font-semibold text-left">
          {normalizeMessage(message.content)}
        </p>
        </div>
      </div>
    );
  } else return <></>;
};

export default PromptHeader;
