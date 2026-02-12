import { assets } from "../../assets/assets";

const PromptHeader = ({ message, normalizeMessage, messageType }) => {
  if (messageType === "user") {
    return (
      <div className="flex items-start justify-start gap-2 w-full">
        <img
          src={assets.userIcon}
          alt=""
          className="h-[14px] sm:h-[20px] flex-shrink-0"
        />
        <div className="max-w-[100%]">
          <p className="break-words text-[#515151] font-medium text-left bg-pink-50 pl-4 pr-4 px-2 py-2 rounded-2xl">
            {normalizeMessage(message.content)}
          </p>
        </div>
      </div>
    );
  } else return <></>;
};

export default PromptHeader;
