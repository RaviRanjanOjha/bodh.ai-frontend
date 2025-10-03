import { assets } from '../../assets/assets';
import SkeletonLoader from './SkeletonLoader';
import ReactMarkdown from 'react-markdown'
import './Dashboard.css'
import { useState } from 'react';

const PromptContent = ({
    loading,
    message,
    normalizeMessage,
    messageType,
    index,
    messages
}) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const isImageUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
        const isUrl = url.startsWith('http://') || url.startsWith('https://');
        return isUrl && (imageExtensions.test(url) || url.includes('blob.core.windows.net'));
    };

    const isExcelUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        return url.endsWith('.xlsx');
    };

    let imageLink = null;
    let excelLink = null;
    if (message.content && typeof message.content === 'string') {
        if (message.content.includes('|')) {
            const [first, second] = message.content.split('|').map(s => s.trim());
            if (isImageUrl(first)) imageLink = first;
            if (isExcelUrl(second)) excelLink = second;
        } else {
            const val = message.content.trim();
            if (isImageUrl(val)) imageLink = val;
            else if (isExcelUrl(val)) excelLink = val;
        }
    }

    if (messageType === 'assistant') {
        return (
            <div className="relative flex flex-row">
                <div className="w-[27px] flex-shrink-0 overflow-hidden ">
                    <img src={assets.ai_stars} alt="Prompt Heading" className=" h-[28px] scale-[2.5] object-cover object-center" />
                </div>

                <div className="pl-4 text-[#2e2e2e] h-full w-full overflow-y-auto pr-4 no-scrollbar">
                    {loading && index === messages.length - 1 ? (
                        <SkeletonLoader isNewChat={true} />
                    ) : (
                        <div className="space-y-4 markdown-body">
                            {imageLink && excelLink ? (
                                <div className="mb-2 flex flex-col gap-1 ">
                                    <div
                                        className="relative w-full overflow-auto"
                                        style={{ maxHeight: isZoomed ? '340px' : '230px', minHeight: isZoomed ? '160px' : 'auto' }}
                                    >
                                        <img
                                            src={imageLink}
                                            alt="Generated Image"
                                            className={`transition-transform duration-300 ${isZoomed ? 'scale-[2.5] cursor-zoom-out' : 'scale-100 cursor-zoom-in'} origin-top-left block`}
                                            onClick={() => setIsZoomed((prev) => !prev)}
                                            style={{ display: "block", margin: "0" }}
                                        />
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                        <a
                                            href={excelLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-full shadow-md p-2 text-gray-900 text-sm bg-stone-300 hover:cursor-pointer hover:bg-stone-400"
                                            download
                                        >
                                            Download As Excel
                                        </a>
                                    </div>
                                </div>
                            ) : imageLink ? (
                                <div className="mb-2 flex flex-col gap-1">
                                    <div
                                        className="relative w-full overflow-auto"
                                        style={{ maxHeight: isZoomed ? '340px' : '230px', minHeight: isZoomed ? '160px' : 'fit-content' }}
                                    >
                                        <img
                                            src={imageLink}
                                            alt="Generated Image"
                                            className={`transition-transform duration-300 ${isZoomed ? 'scale-[1.5] cursor-zoom-out' : 'scale-100 cursor-zoom-in'} origin-top-left block`}
                                            onClick={() => setIsZoomed((prev) => !prev)}
                                            style={{ display: "block", margin: "0" }}
                                        />
                                    </div>
                                </div>
                            ) : excelLink ? (
                                <div style={{ marginTop: 8 }}>
                                    <a
                                        href={excelLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full shadow-md p-2 text-gray-900 text-sm bg-stone-300 hover:cursor-pointer hover:bg-stone-400"
                                        download
                                    >
                                        Download As Excel
                                    </a>
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
        )
    }
    else return (<></>)
};

export default PromptContent;
