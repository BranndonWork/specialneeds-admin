import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import DOMPurify from "dompurify";
import { useEffect } from "react";

const BTN = {
  base: {
    padding: "4px 10px",
    fontSize: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
    color: "#444",
    fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
  },
  active: {
    background: "#e8f4fb",
    borderColor: "#0281c4",
    color: "#0281c4",
    fontWeight: 600,
  },
};

function ToolbarButton({ onClick, isActive, children, title }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      style={{ ...BTN.base, ...(isActive ? BTN.active : {}) }}
    >
      {children}
    </button>
  );
}

export default function TipTapEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      const html = DOMPurify.sanitize(editor.getHTML());
      onChange(html);
    },
  });

  useEffect(() => {
    if (!editor || value === undefined) return;
    if (editor.isFocused) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  const setLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden", background: "#fff" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        padding: "8px 10px",
        borderBottom: "1px solid #e5e7eb",
        background: "#f9fafb",
      }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor?.isActive("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive("italic")}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor?.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor?.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive("blockquote")}
          title="Blockquote"
        >
          ❝
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive("bulletList")}
          title="Bullet List"
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive("orderedList")}
          title="Ordered List"
        >
          1. List
        </ToolbarButton>
        <ToolbarButton onClick={setLink} isActive={editor?.isActive("link")} title="Link">
          Link
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear formatting"
        >
          ✕ Clear
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: "400px",
          padding: "16px",
          fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
          fontSize: "14px",
          lineHeight: "1.7",
          color: "#221638",
        }}
      />
    </div>
  );
}
