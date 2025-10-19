import { ChannelHeader } from './_components/channelHeader';
import { MessageInputForm } from './_components/message/MessageInputForm';
import { MessageList } from './_components/MessageList';

export default function ChannelPageMain() {
  return (
    <div className="flex h-screen w-full">
      {/* main channel are*/}
      <div className="flex flex-col flex-1 min-w-0">
        <ChannelHeader />
        
        {/* scrollable messages area */}
        <div className="flex-1 overflow-hidden mb-4">
          <MessageList />
        </div>

        {/* fixed input */}
        <div className="border-t bg-background p-4">
          <MessageInputForm />
        </div>
      </div>
    </div>
  );
}
