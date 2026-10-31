"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Bold, Highlighter, ImageIcon, Italic, Link2, Loader2, Underline } from "lucide-react";

import { PromptDialog, type PromptRequest } from "@/components/admin/editor/prompt-dialog";
import { SlashCommand, type EditorActions } from "@/components/admin/editor/slash-command";
import { Btn, Toolbar } from "@/components/admin/editor/toolbar";
import { ACCEPTED_IMAGE_TYPES, cloudinaryUrl, postImageFolder, uploadImage } from "@/lib/blog/cloudinary";
import { parseYouTubeId } from "@/lib/blog/youtube";
import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);
const INLINE_IMAGE_TRANSFORM = "c_limit,w_1600,q_auto,f_auto";

type RichTextEditorProps = {
  postId: string;
  initialContent: Record<string, unknown> | string | null;
  onChange: (json: Record<string, unknown>, html: string) => void;
};

export function RichTextEditor({ postId, initialContent, onChange }: RichTextEditorProps) {
  const [prompt, setPrompt] = useState<PromptRequest | null>(null);
  const [uploading, setUploading] = useState<{ name: string; progress: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);

  // Latest versions of the actions, read by the slash menu and the paste/drop handlers.
  const actionsRef = useRef<EditorActions & { uploadFiles: (files: File[]) => void; openLink: () => void }>(null!);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Placeholder.configure({ placeholder: "Start writing, or type / to insert a heading, image, video, table…" }),
      CharacterCount,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Subscript,
      Superscript,
      Typography,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Youtube.configure({ nocookie: true, modestBranding: true, rel: 0, width: 640, height: 360 }),
      CodeBlockLowlight.configure({ lowlight }),
      SlashCommand.configure({ getActions: () => actionsRef.current }),
    ],
    content: initialContent ?? "",
    editorProps: {
      attributes: {
        class: "post-content prose prose-lg max-w-none min-h-[480px] px-6 py-6 focus:outline-none sm:px-10",
      },
      handlePaste: (_view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (!files.length) return false;
        actionsRef.current.uploadFiles(files);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        const files = imageFiles(event.dataTransfer?.files);
        if (moved || !files.length) return false;
        const position = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (position) editorRef.current?.commands.setTextSelection(position.pos);
        actionsRef.current.uploadFiles(files);
        return true;
      },
      handleKeyDown: (_view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
          event.preventDefault();
          actionsRef.current.openLink();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as Record<string, unknown>, editor.getHTML()),
  });

  editorRef.current = editor;

  const askAltText = (onDone: (alt: string) => void, initial = "") =>
    setPrompt({
      title: "Describe this image",
      label: "Alt text",
      placeholder: "e.g. Masjid an-Nabawi courtyard at sunset",
      hint: "Helps visually impaired readers and Google understand the image.",
      initialValue: initial,
      allowEmpty: true,
      submitLabel: "Save",
      onSubmit: onDone,
    });

  const uploadFiles = async (files: File[]) => {
    if (!editor) return;
    setUploadError(null);

    for (const file of files) {
      setUploading({ name: file.name, progress: 0 });
      try {
        const uploaded = await uploadImage(file, postImageFolder(postId), (progress) => setUploading({ name: file.name, progress }));
        const src = cloudinaryUrl(uploaded.publicId, INLINE_IMAGE_TRANSFORM);
        editor.chain().focus().setImage({ src, alt: "" }).run();
        askAltText((alt) => editor.chain().focus().updateAttributes("image", { alt }).run());
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Image upload failed.");
      }
    }
    setUploading(null);
  };

  const openLink = () => {
    if (!editor) return;
    const current = (editor.getAttributes("link").href as string | undefined) ?? "";
    setPrompt({
      title: current ? "Edit link" : "Add link",
      label: "URL",
      placeholder: "https://… or /contact",
      hint: "Leave empty to remove the link.",
      initialValue: current,
      allowEmpty: true,
      validate: (value) => (normaliseUrl(value) ? null : "Enter a valid web address, email (mailto:) or site path (/…)."),
      onSubmit: (value) => {
        const href = normaliseUrl(value);
        if (!href) editor.chain().focus().extendMarkRange("link").unsetLink().run();
        else editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
      },
    });
  };

  const addYoutube = () => {
    if (!editor) return;
    setPrompt({
      title: "Embed a YouTube video",
      label: "YouTube link",
      placeholder: "https://www.youtube.com/watch?v=…",
      hint: "Watch, Shorts, youtu.be and embed links all work. Tip: pasting a link on its own line embeds it too.",
      submitLabel: "Embed video",
      validate: (value) => (parseYouTubeId(value) ? null : "That doesn't look like a YouTube video link."),
      onSubmit: (value) => {
        const id = parseYouTubeId(value);
        if (id) editor.chain().focus().setYoutubeVideo({ src: `https://www.youtube.com/watch?v=${id}` }).run();
      },
    });
  };

  actionsRef.current = {
    pickImage: () => fileInputRef.current?.click(),
    addYoutube,
    uploadFiles,
    openLink,
  };

  // Escape leaves full-screen mode.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && !prompt && setFullscreen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, prompt]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white",
        fullscreen && "fixed inset-0 z-[60] overflow-y-auto rounded-none border-0 [&_.editor-toolbar]:sticky [&_.editor-toolbar]:top-0",
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(event) => {
          uploadFiles(imageFiles(event.target.files));
          event.target.value = "";
        }}
      />

      {editor && (
        <>
          <Toolbar
            editor={editor}
            onLink={openLink}
            onImage={() => fileInputRef.current?.click()}
            onYoutube={addYoutube}
            fullscreen={fullscreen}
            onToggleFullscreen={() => setFullscreen((value) => !value)}
          />
          <SelectionMenu editor={editor} onLink={openLink} onAltText={askAltText} />
        </>
      )}

      <div className={cn(fullscreen && "mx-auto max-w-4xl")}>
        <EditorContent editor={editor} />
      </div>

      {editor && <StatusBar editor={editor} uploading={uploading} uploadError={uploadError} />}

      {prompt && <PromptDialog request={prompt} onClose={() => setPrompt(null)} />}
    </div>
  );
}

// Floating menu over selected text (formatting) or a selected image (alt text).
function SelectionMenu({
  editor,
  onLink,
  onAltText,
}: {
  editor: Editor;
  onLink: () => void;
  onAltText: (onDone: (alt: string) => void, initial?: string) => void;
}) {
  const s = useEditorState({
    editor,
    selector: ({ editor }) => ({
      image: editor.isActive("image"),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      link: editor.isActive("link"),
      highlight: editor.isActive("highlight"),
    }),
  });

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor, state }) =>
        editor.isEditable &&
        (editor.isActive("image") || (!state.selection.empty && !editor.isActive("codeBlock") && !editor.isActive("youtube")))
      }
      className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
    >
      {s.image ? (
        <button
          type="button"
          onClick={() =>
            onAltText(
              (alt) => editor.chain().focus().updateAttributes("image", { alt }).run(),
              (editor.getAttributes("image").alt as string) ?? "",
            )
          }
          className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <ImageIcon className="h-4 w-4" />
          Edit alt text
        </button>
      ) : (
        <>
          <Btn icon={Bold} label="Bold" active={s.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
          <Btn icon={Italic} label="Italic" active={s.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <Btn icon={Underline} label="Underline" active={s.underline} onClick={() => editor.chain().focus().toggleUnderline().run()} />
          <Btn
            icon={Highlighter}
            label="Highlight"
            active={s.highlight}
            onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
          />
          <Btn icon={Link2} label="Link" active={s.link} onClick={onLink} />
        </>
      )}
    </BubbleMenu>
  );
}

function StatusBar({
  editor,
  uploading,
  uploadError,
}: {
  editor: Editor;
  uploading: { name: string; progress: number } | null;
  uploadError: string | null;
}) {
  const counts = useEditorState({
    editor,
    selector: ({ editor }) => {
      const storage = editor.storage as unknown as { characterCount: { words: () => number; characters: () => number } };
      return { words: storage.characterCount.words(), characters: storage.characterCount.characters() };
    },
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
      <span>
        {counts.words} words · {counts.characters} characters · {Math.max(1, Math.ceil(counts.words / 200))} min read
      </span>
      {uploading ? (
        <span className="flex items-center gap-1.5 font-semibold text-primary">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Uploading {uploading.name}… {uploading.progress}%
        </span>
      ) : uploadError ? (
        <span className="font-semibold text-red-600">{uploadError}</span>
      ) : (
        <span>Type / for blocks · paste or drop images</span>
      )}
    </div>
  );
}

function imageFiles(list: FileList | null | undefined) {
  return Array.from(list ?? []).filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
}

function normaliseUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed) || trimmed.startsWith("/")) return trimmed;
  if (/^[\w-]+(\.[\w-]+)+/.test(trimmed)) return `https://${trimmed}`;
  return null;
}
