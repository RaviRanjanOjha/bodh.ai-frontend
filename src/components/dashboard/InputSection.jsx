import { useContext } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const InputSection = ({
  value,
  onChange,
  onSend,
  onStop,
  disabled,
  onFocus,
  onBlur,
  inputFocus,
}) => {
  const { isStreaming } = useContext(Context);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn’t support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange({ target: { value: transcript } }); // Inject text into input
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  return (
    <div
      className={`w-[75%] overflow-hidden border border-[rgba(0,0,0,0.20)] rounded-[28px] transition-all duration-300 ease-out 
                ${
                  inputFocus
                    ? "flex flex-col items-stretch h-24 sm:h-36 px-3 sm:px-5 py-2 sm:py-3"
                    : "flex flex-row items-center justify-between h-12 sm:h-16 pr-1.5 sm:pr-3 pl-1 sm:pl-2"
                }`}
    >
      {inputFocus ? (
        <>
          <div className="w-full h-full mb-1">
            <textarea
              rows={1}
              className="border-none text-gray-900 text-xs sm:text-sm rounded-lg block w-full h-full px-2.5 
                                focus:outline-none resize-none overflow-auto no-scrollbar"
              placeholder="What can we explore together today?"
              value={value}
              onChange={onChange}
              disabled={disabled}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim() !== "") {
                  e.preventDefault();
                  onSend();
                }
              }}
            />
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="flex items-end gap-2 sm:gap-3">
              <img
                src={assets.ai_search_icon}
                alt="search icon"
                className="h-7 sm:h-10"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={assets.mic}
                alt="mic icon"
                onClick={handleVoiceInput}
                className="cursor-pointer p-2 bg-transparent text-gray-600 rounded-full hover:bg-gray-200 h-9 sm:h-12"
              />

              {value.trim() !== "" ? (
                <img
                  src={assets.arrow_forw}
                  alt="arrow icon"
                  onClick={isStreaming ? onStop : onSend}
                  className="cursor-pointer p-2 bg-transparent text-gray-600 border border-[#DFD0E9] rounded-full hover:bg-gray-200 h-9 sm:h-12"
                />
              ) : (
                <img
                  src={assets.arrow_forw}
                  alt="arrow icon"
                  className="p-2 bg-transparent text-gray-400 border border-[#DFD0E9] rounded-full opacity-50 cursor-not-allowed h-9 sm:h-12"
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3 w-full h-full">
          <img
            src={assets.ai_search_icon}
            alt="search icon"
            className="h-7 sm:h-10"
          />
          <textarea
            type="text"
            rows={1}
            className="border-none text-gray-900 text-xs sm:text-sm rounded-lg block w-full h-auto p-2.5 
                            focus:outline-none resize-none overflow-auto no-scrollbar"
            placeholder="What can we explore together today?"
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim() !== "") {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <img
            src={assets.mic}
            alt="mic icon"
            onClick={handleVoiceInput}
            className="cursor-pointer p-2 bg-transparent text-gray-600 rounded-full hover:bg-gray-200 h-9 sm:h-12"
          />

          {value.trim() !== "" ? (
            <img
              src={assets.arrow_forw}
              alt="arrow icon"
              onClick={isStreaming ? onStop : onSend}
              className="cursor-pointer p-2 bg-transparent text-gray-600 border border-[#DFD0E9] rounded-full hover:bg-gray-200 h-9 sm:h-12"
            />
          ) : (
            <img
              src={assets.arrow_forw}
              alt="arrow icon"
              className="p-2 bg-transparent text-gray-400 border border-[#DFD0E9] rounded-full opacity-50 cursor-not-allowed h-9 sm:h-12"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InputSection;
