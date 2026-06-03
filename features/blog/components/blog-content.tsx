"use client";

import { Image } from "@tiptap/extension-image";
import { Link as LinkExt } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

type BlogContentProps = {
  content: object;
  className?: string;
};

export function BlogContent({ content, className }: BlogContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExt.configure({ openOnClick: true, HTMLAttributes: { class: "text-primary underline-offset-4 hover:underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-lg max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl",
          className
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(content);
  }, [content, editor]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
