"use client";

import * as React from "react";
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

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

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

import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

import "@/styles/course-editor.css";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";

interface CourseEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

export function CourseEditor({
  initialValue = "",
  onChange,
}: CourseEditorProps) {
  const toolbarRef = React.useRef<HTMLDivElement>(null);

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
      Link.configure({ openOnClick: false }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="bg-white rounded-lg">
        <Toolbar ref={toolbarRef}>
          <Spacer></Spacer>
          <ToolbarGroup>
            <UndoRedoButton action="undo" />
            <UndoRedoButton action="redo" />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <HeadingDropdownMenu levels={[1, 2, 3]} />
            <ListDropdownMenu types={["bulletList", "orderedList"]} />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <MarkButton type="bold" />
            <MarkButton type="italic" />
            <MarkButton type="underline" />
            <ColorHighlightPopover />
            <LinkPopover />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <TextAlignButton align="left" />
            <TextAlignButton align="center" />
            <TextAlignButton align="right" />
          </ToolbarGroup>

          <Spacer></Spacer>
        </Toolbar>
        <div className="course-content-wrapper">
          <EditorContent editor={editor} role="presentation" />
        </div>
      </div>
    </EditorContext.Provider>
  );
}
