"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Code, Code2,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus,
  Link as LinkIcon, Unlink,
  Undo2, Redo2,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{ all: "unset" }}
      className={[
        "flex items-center justify-center w-8 h-8 rounded cursor-pointer transition-all select-none",
        "text-sm font-medium",
        active
          ? "bg-blue-100 text-blue-700 dark:bg-white/20 dark:text-white"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-300 dark:bg-white/10 mx-0.5 flex-shrink-0" />;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: {
          HTMLAttributes: { class: "code-block" },
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-400 underline cursor-pointer" },
      }),
      PlaceholderExtension.configure({
        placeholder: "Start writing your article here...\n\nTip: Use H2 for step headings (e.g. \"Step 1 — Installing Jenkins\"), code blocks for commands, and inline code for file paths.",
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rte-editor",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rte-wrapper">
      {/* ── Toolbar ── */}
      <div className="rte-toolbar">

        {/* History */}
        <ToolbarButton title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 size={15} />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton title='Heading 2 — "Step X" like DigitalOcean' onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <Heading3 size={15} />
        </ToolbarButton>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <Strikethrough size={15} />
        </ToolbarButton>
        <ToolbarButton title="Inline Code (Ctrl+E)" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>
          <Code size={15} />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={15} />
        </ToolbarButton>

        <Divider />

        {/* Block elements */}
        <ToolbarButton title="Code Block (for commands)" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
          <Code2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Blockquote (for notes/callouts)" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton title="Horizontal Rule (section divider)" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={15} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton title="Add Link" onClick={setLink} active={editor.isActive("link")}>
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton title="Remove Link" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")}>
          <Unlink size={15} />
        </ToolbarButton>
      </div>

      {/* ── Cheat Sheet ── */}
      <div className="rte-hint">
        <span className="rte-hint-item"><kbd>H2</kbd> Step heading</span>
        <span className="rte-hint-item"><kbd>H3</kbd> Sub-heading</span>
        <span className="rte-hint-item"><kbd>Code2</kbd> Command block</span>
        <span className="rte-hint-item"><kbd>`code`</kbd> Inline path</span>
        <span className="rte-hint-item"><kbd>Quote</kbd> Note/callout</span>
      </div>

      {/* ── Editor Area ── */}
      <EditorContent editor={editor} />
    </div>
  );
}
