import { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const InputSection = ({
    value,
    onChange,
    onSend,
    onStop,
    disabled,
    onFocus,
    onBlur,
    inputFocus
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
            className={`w-[55%] border border-[rgba(0,0,0,0.20)] rounded-[28px] flex justify-between items-center prompt-enter transition-all duration-300 ease-out ${inputFocus ? 'h-36 pr-5 pl-3' : 'h-16 pr-3 pl-2'}`}
        >
            <div className="flex items-center gap-3 w-full h-full">
                <img src={assets.ai_search_icon} alt="search icon" className='h-[36px]' />
                <textarea
                    type="text"
                    rows={1}
                    className="border-none text-gray-900 text-sm rounded-lg block w-full h-auto p-2.5 focus:outline-none resize-none overflow-auto no-scrollbar max-h-[90%]"
                    placeholder="What can we explore together today?"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && value.trim() !== '') {
                            e.preventDefault();
                            onSend();
                        }
                    }}
                />
                <img
                    src={assets.mic}
                    alt="mic icon"
                    onClick={handleVoiceInput}
                    className="cursor-pointer p-2 bg-transparent text-gray-600 rounded-full hover:bg-gray-200 arrow-up h-[40px]" />

                {value.trim() !== '' ? (
                    <img
                        src={assets.arrow_forw}
                        alt="arrow icon"
                        onClick={isStreaming ? onStop : onSend}
                        className="cursor-pointer p-2 bg-transparent text-gray-600 border border-[#DFD0E9] rounded-full hover:bg-gray-200 arrow-up h-[40px]"
                    />
                ) : (
                    <img
                        src={assets.arrow_forw}
                        alt="arrow icon"
                        className="p-2 bg-transparent text-gray-400 border border-[#DFD0E9] rounded-full opacity-50 cursor-not-allowed h-[40px]"
                    />
                )}
            </div>
        </div>
    );
};

export default InputSection;
