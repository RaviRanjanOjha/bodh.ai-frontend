import PromptHeader from './PromptHeader';
import PromptContent from './PromptContent';
import PromptControls from './PromptControls';

const PromptSection = ({ loading, resultData }) => {

  const normalizeMessage = (raw) => {
    return raw.replace(/<br\s*\/?>/gi, "\n");
  };

  const parseConversationData = () => {
    if (!resultData) return [];

    const sections = resultData
      .split("<br/><br/>")
      .filter((section) => section.trim());
    const messages = [];

    sections.forEach((section, index) => {
      const cleanSection = section.trim();

      if (cleanSection.includes("<strong>user:</strong>")) {
        const userMessage = cleanSection
          .replace("<strong>user:</strong>", "")
          .trim();
        const timestampMatch = userMessage.match(
          /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)\]/
        );
        const timestamp = timestampMatch ? timestampMatch[1] : null;
        const content = timestamp
          ? userMessage.replace(/\[.*?\]/, "").trim()
          : userMessage;

        messages.push({
          type: "user",
          content: content,
          timestamp: timestamp,
          index: `user - ${index}`,
        });
      } else if (cleanSection.includes("<strong>assistant:</strong>")) {
        const assistantMessage = cleanSection
          .replace("<strong>assistant:</strong>", "")
          .trim();
        const timestampMatch = assistantMessage.match(
          /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)\]/
        );
        const timestamp = timestampMatch ? timestampMatch[1] : null;
        const content = timestamp
          ? assistantMessage.replace(/\[.*?\]/, "").trim()
          : assistantMessage;

        messages.push({
          type: "assistant",
          content: content,
          timestamp: timestamp,
          index: `assistant - ${index}`,
        });
      } else if (cleanSection && !cleanSection.includes("<strong>")) {
        messages.push({
          type: "assistant",
          content: cleanSection,
          timestamp: null,
          index: `content - ${index}`,
        });
      }
    });

    return messages;
  };

  const messages = parseConversationData();

  return (
    <>
      <div className="message-container overflow-y-auto h-[90vh] px-4 no-scrollbar">
        {messages.map((message, idx) => (
          <div className="flex flex-col justify-between mb-4" key={message.index}>
            <div className="top-content flex flex-col gap-5">
              <PromptHeader
                message={message}
                normalizeMessage={(e) => normalizeMessage(e)}
                messageType={message.type}
              />
              <PromptContent
                loading={loading}
                message={message}
                normalizeMessage={(e) => normalizeMessage(e)}
                messageType={message.type}
                index={idx}
                messages={messages}
              />
              {message.type === "assistant" && message.content != "Analysing.." && (
                <PromptControls message={message} />
              )}

            </div>
          </div>
        ))}
      </div>
    </>
  )
};

export default PromptSection;