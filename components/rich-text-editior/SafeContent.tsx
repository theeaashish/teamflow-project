import { convertJsonToHtml } from '@/lib/json-to-html';
import { type JSONContent } from '@tiptap/react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

interface SafeContentProps {
  content: JSONContent;
}

export function SafeContent({ content }: SafeContentProps) {
  const html = convertJsonToHtml(content);
  const clean = DOMPurify.sanitize(html);

  return <div>{parse(clean)}</div>;
}
