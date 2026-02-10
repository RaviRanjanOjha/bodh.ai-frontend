import { assets } from '../../assets/assets';
import TextToSpeech from '../Text_To_Speech/TextToSpeech';
import DownloadFile from './DownloadFile';

const PromptControls = ({ message }) => {
    const isUrl = (content) => {
        if (content.trim().endsWith('.xlsx') || content.trim().endsWith('.png')) {
            return true;
        }
        return false;
    }
    const getExcelUrl = (content) => {
        if (!content || typeof content !== 'string') return null;
        if (content.includes('|')) {
            const [first, second] = content.split('|').map(s => s.trim());
            if (second.endsWith('.xlsx')) return second;
        } else if (content.trim().endsWith('.xlsx')) {
            return content.trim();
        }
        return null;
    };

    const excelUrl = getExcelUrl(message.content);
    const url = isUrl(message.content);
    return (
        <div className="control-icons flex pr-[42px] pb-[32px] gap-3.5 justify-end">
            <img src={assets.share_new} alt="share" className='h-4 sm:h-6' />
            <img src={assets.thumb_up} alt="thumb up" className='h-4 sm:h-6' />
            <img src={assets.thumb_down} alt="thumb down" className='h-4 sm:h-6' />
            <img src={assets.edit} alt="edit" className='h-4 sm:h-6' />
            {!url && <TextToSpeech inputText={message.content} />}
            {excelUrl && <DownloadFile downloadLink={excelUrl} />}
        </div>
    )
};

export default PromptControls;
