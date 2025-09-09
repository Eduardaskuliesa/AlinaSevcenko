"use client";

import * as React from "react";
import DOMPurify from "dompurify";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";

// --- Tiptap Node ---
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

import "@/styles/course-editor.css";

interface CourseEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

export function CourseEditor({
  initialValue = "",
  onChange,
}: CourseEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Course description editor, start typing to enter text.",
        class: "course-editor-content min-h-60 p-4 text-base bg-white",
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Typography,
      Highlight.configure({ multicolor: true }),
      Selection,
      TrailingNode,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const rawHTML = editor.getHTML();
      const cleanHTML = DOMPurify.sanitize(rawHTML);
      onChange(cleanHTML);
    },
  });

  React.useEffect(() => {
    if (editor && initialValue !== editor.getHTML()) {
      editor.commands.setContent(initialValue);
    }
  }, [editor, initialValue]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="@container rounded-lg">
        <div className="flex flex-wrap items-center p-1 border border-gray-200 border-b-0 rounded-t-lg bg-slate-50 @sm:gap-2 @md:justify-center @lg:gap-3">
          <UndoRedoButton action="undo" />
          <UndoRedoButton action="redo" />
          <div className="w-px h-6 bg-gray-300" />
          <HeadingDropdownMenu levels={[1, 2, 3]} />
          <ListDropdownMenu types={["bulletList", "orderedList"]} />
          <div className="w-px h-6 bg-gray-300" />
          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="underline" />
          <ColorHighlightPopover />
          <LinkPopover />
          <div className="w-px h-6 bg-gray-300" />
          <TextAlignButton align="left" />
          <TextAlignButton align="center" />
          <TextAlignButton align="right" />
        </div>
        <div className="course-content-wrapper">
          <EditorContent editor={editor} role="presentation" />
        </div>
      </div>
    </EditorContext.Provider>
  );
}
