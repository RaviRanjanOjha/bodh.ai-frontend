import { assets } from '../../assets/assets';
import TextToSpeech from '../Text_To_Speech/TextToSpeech';

const PromptControls = ({message}) => (
    <div className="control-icons flex pl-[42px] pb-[32px] gap-3.5">
        <img src={assets.share_new} alt="share" className='h-6' />
        <img src={assets.thumb_up} alt="thumb up" className='h-6' />
        <img src={assets.thumb_down} alt="thumb down" className='h-6' />
        <img src={assets.edit} alt="edit" className='h-6' />
        <TextToSpeech inputText={message.content} />
    </div>
);

export default PromptControls;
