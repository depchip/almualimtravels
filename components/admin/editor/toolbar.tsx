"use client";

import { useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Code,
  CodeSquare,
  Columns3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Maximize2,
  Minimize2,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Rows3,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Trash2,
  Underline,
  Undo2,
  Youtube,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const TEXT_COLORS = [
  { name: "Default", value: "" },
  { name: "Brand blue", value: "#1d4f9c" },
  { name: "Gold", value: "#b8860b" },
  { name: "Green", value: "#15803d" },
  { name: "Red", value: "#b91c1c" },
  { name: "Grey", value: "#64748b" },
];

export const HIGHLIGHT_COLORS = [
  { name: "None", value: "" },
  { name: "Yellow", value: "#fef08a" },
  { name: "Gold", value: "#fde68a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
];

type ToolbarProps = {
  editor: Editor;
  onLink: () => void;
  onImage: () => void;
  onYoutube: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
};

export function Toolbar({ editor, onLink, onImage, onYoutube, fullscreen, onToggleFullscreen }: ToolbarProps) {
  const [palette, setPalette] = useState<"color" | "highlight" | null>(null);

  const s = useEditorState({
    editor,
    selector: ({ editor }) => ({
      block: editor.isActive("heading", { level: 2 })
        ? "h2"
        : editor.isActive("heading", { level: 3 })
          ? "h3"
          : editor.isActive("heading", { level: 4 })
            ? "h4"
            : "p",
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      subscript: editor.isActive("subscript"),
      superscript: editor.isActive("superscript"),
      link: editor.isActive("link"),
      color: (editor.getAttributes("textStyle").color as string | undefined) ?? "",
      highlight: editor.isActive("highlight"),
      left: editor.isActive({ textAlign: "left" }),
      center: editor.isActive({ textAlign: "center" }),
      right: editor.isActive({ textAlign: "right" }),
      justify: editor.isActive({ textAlign: "justify" }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      taskList: editor.isActive("taskList"),
      blockquote: editor.isActive("blockquote"),
      codeBlock: editor.isActive("codeBlock"),
      table: editor.isActive("table"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  const setBlock = (value: string) => {
    if (value === "p") chain().setParagraph().run();
    else chain().setHeading({ level: Number(value.slice(1)) as 2 | 3 | 4 }).run();
  };

  return (
    // Sticky from tablet up; on phones the wrapped toolbar is several rows tall, so it scrolls away
    // and the floating selection menu and "/" menu cover formatting.
    <div className="editor-toolbar z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur md:sticky md:top-16">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <select
          value={s.block}
          onChange={(event) => setBlock(event.target.value)}
          aria-label="Text style"
          className="mr-1 h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        <Btn icon={Bold} label="Bold (Ctrl+B)" active={s.bold} onClick={() => chain().toggleBold().run()} />
        <Btn icon={Italic} label="Italic (Ctrl+I)" active={s.italic} onClick={() => chain().toggleItalic().run()} />
        <Btn icon={Underline} label="Underline (Ctrl+U)" active={s.underline} onClick={() => chain().toggleUnderline().run()} />
        <Btn icon={Strikethrough} label="Strikethrough" active={s.strike} onClick={() => chain().toggleStrike().run()} />
        <Btn icon={Code} label="Inline code" active={s.code} onClick={() => chain().toggleCode().run()} />
        <Btn icon={Subscript} label="Subscript" active={s.subscript} onClick={() => chain().toggleSubscript().run()} />
        <Btn icon={Superscript} label="Superscript" active={s.superscript} onClick={() => chain().toggleSuperscript().run()} />

        <div className="relative">
          <Btn icon={Baseline} label="Text colour" active={!!s.color} onClick={() => setPalette(palette === "color" ? null : "color")} swatch={s.color} />
          {palette === "color" && (
            <Palette
              colors={TEXT_COLORS}
              onPick={(value) => {
                if (value) chain().setColor(value).run();
                else chain().unsetColor().run();
                setPalette(null);
              }}
            />
          )}
        </div>
        <div className="relative">
          <Btn icon={Highlighter} label="Highlight" active={s.highlight} onClick={() => setPalette(palette === "highlight" ? null : "highlight")} />
          {palette === "highlight" && (
            <Palette
              colors={HIGHLIGHT_COLORS}
              onPick={(value) => {
                if (value) chain().setHighlight({ color: value }).run();
                else chain().unsetHighlight().run();
                setPalette(null);
              }}
            />
          )}
        </div>
        <Btn icon={Link2} label="Link (Ctrl+K)" active={s.link} onClick={onLink} />

        <Sep />
        <Btn icon={AlignLeft} label="Align left" active={s.left} onClick={() => chain().setTextAlign("left").run()} />
        <Btn icon={AlignCenter} label="Align centre" active={s.center} onClick={() => chain().setTextAlign("center").run()} />
        <Btn icon={AlignRight} label="Align right" active={s.right} onClick={() => chain().setTextAlign("right").run()} />
        <Btn icon={AlignJustify} label="Justify" active={s.justify} onClick={() => chain().setTextAlign("justify").run()} />

        <Sep />
        <Btn icon={List} label="Bullet list" active={s.bulletList} onClick={() => chain().toggleBulletList().run()} />
        <Btn icon={ListOrdered} label="Numbered list" active={s.orderedList} onClick={() => chain().toggleOrderedList().run()} />
        <Btn icon={ListChecks} label="Checklist" active={s.taskList} onClick={() => chain().toggleTaskList().run()} />
        <Btn icon={Quote} label="Quote" active={s.blockquote} onClick={() => chain().toggleBlockquote().run()} />
        <Btn icon={CodeSquare} label="Code block" active={s.codeBlock} onClick={() => chain().toggleCodeBlock().run()} />
        <Btn icon={Minus} label="Divider line" onClick={() => chain().setHorizontalRule().run()} />

        <Sep />
        <Btn icon={ImagePlus} label="Insert image" onClick={onImage} />
        <Btn icon={Youtube} label="Embed YouTube video" onClick={onYoutube} />
        <Btn icon={Table} label="Insert table" active={s.table} onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />

        <Sep />
        <Btn icon={RemoveFormatting} label="Clear formatting" onClick={() => chain().unsetAllMarks().clearNodes().run()} />
        <Btn icon={Undo2} label="Undo (Ctrl+Z)" disabled={!s.canUndo} onClick={() => chain().undo().run()} />
        <Btn icon={Redo2} label="Redo (Ctrl+Shift+Z)" disabled={!s.canRedo} onClick={() => chain().redo().run()} />
        <Btn icon={fullscreen ? Minimize2 : Maximize2} label={fullscreen ? "Exit full screen" : "Full screen"} onClick={onToggleFullscreen} />
      </div>

      {s.table && (
        <div className="flex flex-wrap items-center gap-1 border-t border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold">
          <span className="mr-2 text-slate-500">Table</span>
          <TableBtn icon={Rows3} label="Row above" onClick={() => chain().addRowBefore().run()} />
          <TableBtn icon={Rows3} label="Row below" onClick={() => chain().addRowAfter().run()} />
          <TableBtn icon={Columns3} label="Column left" onClick={() => chain().addColumnBefore().run()} />
          <TableBtn icon={Columns3} label="Column right" onClick={() => chain().addColumnAfter().run()} />
          <TableBtn icon={Trash2} label="Delete row" onClick={() => chain().deleteRow().run()} />
          <TableBtn icon={Trash2} label="Delete column" onClick={() => chain().deleteColumn().run()} />
          <TableBtn icon={Rows3} label="Toggle header row" onClick={() => chain().toggleHeaderRow().run()} />
          <TableBtn icon={Trash2} label="Delete table" danger onClick={() => chain().deleteTable().run()} />
        </div>
      )}
    </div>
  );
}

type BtnProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  swatch?: string;
};

export function Btn({ icon: Icon, label, onClick, active, disabled, swatch }: BtnProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-foreground disabled:opacity-30",
        active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
      )}
    >
      <Icon className="h-4 w-4" />
      {swatch && <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 rounded" style={{ background: swatch }} />}
    </button>
  );
}

function TableBtn({ icon: Icon, label, onClick, danger }: { icon: LucideIcon; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-100",
        danger ? "text-red-600" : "text-slate-600",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Palette({ colors, onPick }: { colors: { name: string; value: string }[]; onPick: (value: string) => void }) {
  return (
    <div className="absolute left-0 top-10 z-30 flex gap-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
      {colors.map((color) => (
        <button
          key={color.name}
          type="button"
          title={color.name}
          aria-label={color.name}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onPick(color.value)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-xs text-slate-400 hover:scale-110"
          style={{ background: color.value || "white" }}
        >
          {color.value ? "" : "∅"}
        </button>
      ))}
    </div>
  );
}

function Sep() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-slate-200" />;
}
