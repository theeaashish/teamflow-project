'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { MessageItem } from './message/MessageItem';
import { orpc } from '@/lib/orpc';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/general/EmptyState';
import { ChevronDown, Loader } from 'lucide-react';

export function MessageList() {
  const { channelId } = useParams<{ channelId: string }>();
  const [hasInitialScrolled, setHasInitialScrolled] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastItemIdRef = useRef<string | undefined>(undefined);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [newMessages, setNewMessages] = useState<boolean>(false);

  const infniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 30,
    }),
    queryKey: ['message.list', channelId],
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages]
        .map((page) => ({
          ...page,
          items: [...page.items].reverse(),
        }))
        .reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    ...infniteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  // scroll to the bottom when msg first load
  useEffect(() => {
    if (!hasInitialScrolled && data?.pages.length) {
      const el = scrollRef.current;

      if (el) {
        bottomRef.current?.scrollIntoView({ block: 'end' });
        setHasInitialScrolled(true);
        setIsAtBottom(true);
      }
    }
  }, [hasInitialScrolled, data?.pages.length]);

  // keep view pinned to bottom on late content growth
  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom || !hasInitialScrolled) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ block: 'end' });
        });
      }
    };

    const onImageLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scrollToBottomIfNeeded();
      }
    };

    el.addEventListener('load', onImageLoad, true);

    // resize observer watches for size changes in the container
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded();
    });

    resizeObserver.observe(el);

    // mutationobserver watches the dom changes
    const mutationObserver = new MutationObserver(() => {
      scrollToBottomIfNeeded();
    });

    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();

      el.removeEventListener('load', onImageLoad, true);
      mutationObserver.disconnect();
    };
  }, [isAtBottom, hasInitialScrolled]);

  const isNearBottom = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

  const handleScroll = () => {
    const el = scrollRef.current;

    if (!el) return;

    if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
      const previousScrollHeight = el.scrollHeight;
      const previousScrollTop = el.scrollTop;

      fetchNextPage().then(() => {
        const newScrollHeight = el.scrollHeight;

        el.scrollTop =
          newScrollHeight - previousScrollHeight + previousScrollTop;
      });
    }

    setIsAtBottom(isNearBottom(el));
  };

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const isEmpty = !isLoading && !error && items.length === 0;

  useEffect(() => {
    if (!items.length) return;

    const lastId = items[items.length - 1].id;
    const prevLastId = lastItemIdRef.current;
    const el = scrollRef.current;

    if (prevLastId && lastId !== prevLastId) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });

        setNewMessages(false);
        setIsAtBottom(true);
      } else {
        setNewMessages(true);
      }
    }

    lastItemIdRef.current = lastId;
  }, [items]);

  const scrollToBottom = () => {
    const el = scrollRef.current;

    if (!el) return;

    bottomRef.current?.scrollIntoView({ block: 'end' });

    setNewMessages(false);
    setIsAtBottom(true);
  };

  return (
    <div className="relative h-full">
      <div
        className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {isEmpty ? (
          <EmptyState
            buttonText="Send a message"
            href="#"
            title="No messages yet"
            description="Send a message to start the conversation"
          />
        ) : (
          items?.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}

        <div ref={bottomRef}></div>
      </div>

      {isFetchingNextPage && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-2">
          <div className="flex items-center gap-2 rounded-md bg-gradient-to-b from-white/80 to-transparent dark:from-neutral-900/80 backdrop-blur-sm px-3 py-1 ">
            <Loader className="size-4 animate-spin text-muted-foreground" />
            <span>Loading Messages...</span>
          </div>
        </div>
      )}

      {!isAtBottom && (
        <Button
          type="button"
          onClick={scrollToBottom}
          size={'icon'}
          className="absolute rounded-full bottom-4 right-5 z-20"
        >
          <ChevronDown className="size-4" />
        </Button>
      )}
    </div>
  );
}
