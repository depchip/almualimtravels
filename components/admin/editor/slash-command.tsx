"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Extension, type Editor, type Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionProps } from "@tiptap/suggestion";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import {
  CodeSquare,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Table,
  Youtube,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type EditorActions = {
  pickImage: () => void;
  addYoutube: () => void;
};

type SlashItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  keywords: string;
  run: (editor: Editor, range: Range, actions: EditorActions) => void;
};

const ITEMS: SlashItem[] = [
  {
    title: "Text",
    description: "Plain paragraph",
    icon: Pilcrow,
    keywords: "paragraph p",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "Heading 2",
    description: "Section heading",
    icon: Heading2,
    keywords: "h2 title",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Sub-section heading",
    icon: Heading3,
    keywords: "h3 subtitle",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    title: "Heading 4",
    description: "Small heading",
    icon: Heading4,
    keywords: "h4",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setHeading({ level: 4 }).run(),
  },
  {
    title: "Bullet list",
    description: "Simple bulleted list",
    icon: List,
    keywords: "ul unordered",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    description: "List with numbers",
    icon: ListOrdered,
    keywords: "ol ordered steps",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Checklist",
    description: "List with checkboxes",
    icon: ListChecks,
    keywords: "todo task packing",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Quote",
    description: "Highlighted quotation",
    icon: Quote,
    keywords: "blockquote hadith ayah",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Image",
    description: "Upload a photo",
    icon: ImagePlus,
    keywords: "picture photo upload",
    run: (editor, range, actions) => {
      editor.chain().focus().deleteRange(range).run();
      actions.pickImage();
    },
  },
  {
    title: "YouTube video",
    description: "Embed a video by link",
    icon: Youtube,
    keywords: "video embed",
    run: (editor, range, actions) => {
      editor.chain().focus().deleteRange(range).run();
      actions.addYoutube();
    },
  },
  {
    title: "Table",
    description: "3 × 3 table with header",
    icon: Table,
    keywords: "grid rows columns schedule",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: "Code block",
    description: "Code with highlighting",
    icon: CodeSquare,
    keywords: "code pre",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Horizontal line",
    icon: Minus,
    keywords: "hr rule separator",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
];

type SlashCommandOptions = {
  getActions: () => EditorActions;
};

// Typing "/" at the start of an empty line or after a space opens a menu of blocks to insert.
export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: "slashCommand",

  addOptions() {
    return { getActions: () => ({ pickImage: () => {}, addYoutube: () => {} }) };
  },

  addProseMirrorPlugins() {
    const getActions = this.options.getActions;

    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: "/",
        allowedPrefixes: [" "],
        items: ({ query }) => {
          const q = query.toLowerCase();
          return ITEMS.filter((item) => `${item.title} ${item.keywords}`.toLowerCase().includes(q));
        },
        command: ({ editor, range, props }) => props.run(editor, range, getActions()),
        render: () => {
          let renderer: ReactRenderer<SlashMenuHandle, SlashMenuProps> | null = null;

          const place = (clientRect: SuggestionProps["clientRect"]) => {
            const rect = clientRect?.();
            if (!renderer || !rect) return;
            const element = renderer.element as HTMLElement;
            computePosition({ getBoundingClientRect: () => rect }, element, {
              placement: "bottom-start",
              strategy: "fixed",
              middleware: [offset(8), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
              Object.assign(element.style, { left: `${x}px`, top: `${y}px` });
            });
          };

          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashMenu, { props, editor: props.editor });
              const element = renderer.element as HTMLElement;
              Object.assign(element.style, { position: "fixed", zIndex: "70", left: "0px", top: "0px" });
              document.body.appendChild(element);
              place(props.clientRect);
            },
            onUpdate: (props) => {
              renderer?.updateProps(props);
              place(props.clientRect);
            },
            onKeyDown: ({ event }) => {
              if (event.key === "Escape") {
                renderer?.destroy();
                renderer?.element.remove();
                renderer = null;
                return true;
              }
              return renderer?.ref?.onKeyDown(event) ?? false;
            },
            onExit: () => {
              renderer?.element.remove();
              renderer?.destroy();
              renderer = null;
            },
          };
        },
      }),
    ];
  },
});

type SlashMenuProps = SuggestionProps<SlashItem, SlashItem>;
type SlashMenuHandle = { onKeyDown: (event: KeyboardEvent) => boolean };

const SlashMenu = forwardRef<SlashMenuHandle, SlashMenuProps>(function SlashMenu({ items, command }, ref) {
  const [selected, setSelected] = useState(0);

  useEffect(() => setSelected(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: (event) => {
      if (!items.length) return false;
      if (event.key === "ArrowDown") {
        setSelected((index) => (index + 1) % items.length);
        return true;
      }
      if (event.key === "ArrowUp") {
        setSelected((index) => (index - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        const item = items.at(selected);
        if (item) command(item);
        return true;
      }
      return false;
    },
  }));

  if (!items.length) {
    return <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-xl">No matching blocks</div>;
  }

  return (
    <div className="max-h-80 w-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
      {items.map((item, index) => (
        <button
          key={item.title}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => command(item)}
          onMouseEnter={() => setSelected(index)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left",
            index === selected ? "bg-primary/10" : "hover:bg-slate-50",
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600">
            <item.icon className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">{item.title}</span>
            <span className="block text-xs text-slate-500">{item.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
});
