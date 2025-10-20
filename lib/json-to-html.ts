import { baseExtension } from '@/components/rich-text-editior/extensions';
import { generateHTML, type JSONContent } from '@tiptap/react';

export function convertJsonToHtml(jsonContent: JSONContent): string {
  try {
    const content =
      typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;

    return generateHTML(content, baseExtension);
  } catch {
    console.log('Error converting JSON to HTML');
    return '';
  }
}
