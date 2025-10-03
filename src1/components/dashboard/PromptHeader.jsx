import { assets } from '../../assets/assets';

const PromptHeader = ({ message, normalizeMessage, messageType }) => {
  if (messageType === 'user') {

    return (
      <div className="flex flex-row">
        <p className="w-11 text-[#707070]">
          <img src={assets.userIcon} alt="" className='h-[20px]' />
        </p>
        <p className="text-[#2e2e2e] font-semibold">
          {normalizeMessage(message.content)}
        </p>
      </div>
    )
  }
  else return (<></>);
};

export default PromptHeader;
