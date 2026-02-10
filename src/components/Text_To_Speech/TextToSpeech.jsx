import React, { useState, useEffect } from 'react';
import { RiSpeakFill, RiSpeakLine } from 'react-icons/ri';
import { assets } from '../../assets/assets';

const TextToSpeech = ({ inputText }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = React.useRef(null);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleToggleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            utteranceRef.current = new SpeechSynthesisUtterance(inputText);
            utteranceRef.current.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utteranceRef.current);
            setIsSpeaking(true);
        }
    };

    return (
        <div>
            <img
                src={assets.text_to_speech}
                alt="text to speech"
                onClick={handleToggleSpeak}
                className={"cursor-pointer h-4 sm:h-6"} />
        </div>
    );
};

export default TextToSpeech;
