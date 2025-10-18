import { ReactNode } from 'react';
import { WorkspaceHeader } from './_components/WorkspaceHeader';
import { CreateNewChannel } from './_components/CreateNewChannel';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { ChannelList } from './_components/ChannelList';

export default function ChannelListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex h-full w-80 flex-col bg-secondary border-r border-border">
        {/* header */}
        <div className="flex items-center px-4 h-14 border-b border-border">
          <WorkspaceHeader />
        </div>

        <div className="px-4 py-2">
          <CreateNewChannel />
        </div>

        {/* channel list */}
        <div className="flex-1 overflow-y-auto px-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center w-full justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground">
              Main
              <ChevronDown className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <ChannelList />
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* members list */}
        <div className="px-4 py-2 border-t border-border">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center w-full justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground">
              Members
              <ChevronDown className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>

            <CollapsibleContent>
            {/* TODO */}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </>
  );
}
