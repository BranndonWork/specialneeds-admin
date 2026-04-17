import { useEffect, useRef } from "react";
import Quill from "quill";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import { FormControl, FormLabel, FormErrorMessage, Box } from "@chakra-ui/react";

interface QuillEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  isRequired?: boolean;
  height?: string;
}

const ALLOWED_TAGS = ["p", "h2", "h3", "blockquote", "strong", "em", "u", "s", "ol", "ul", "li", "a"];

const QuillEditor: React.FC<QuillEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Enter content...",
  label,
  error,
  isRequired = false,
  height = "300px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  // Sanitize HTML
  const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS });
  };

  // Initialize Quill once
  useEffect(() => {
    if (!editorRef.current) return;

    // If already initialized and ref exists, skip
    if (quillRef.current && editorRef.current.classList.contains('quill-initialized')) {
      return;
    }

    // If class exists but no ref, remove class (stale state from StrictMode)
    if (editorRef.current.classList.contains('quill-initialized')) {
      editorRef.current.classList.remove('quill-initialized');
    }

    editorRef.current.classList.add('quill-initialized');

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ size: ["small", false, "large"] }],
          ["bold", "italic", "underline", "strike"],
          [{ header: [2, 3, false] }],
          ["blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [false, "center", "right"] }],
          ["link"],
          ["clean"],
        ],
      },
    });

    quillRef.current = quill;

    // Save on blur
    quill.on("selection-change", (range) => {
      if (!range && onChange) {
        let html = quill.root.innerHTML;

        // Remove empty paragraphs (they create unwanted gaps)
        html = html.replace(/<p><br><\/p>/gi, "");
        html = html.replace(/<p>\s*<\/p>/gi, "");

        const sanitized = sanitizeHtml(html);
        const isEmpty = sanitized.trim() === "" || sanitized === "<p><br></p>";
        onChange(isEmpty ? "" : sanitized);
      }
    });

    // Load initial value if it exists
    if (value) {
      const sanitized = sanitizeHtml(value);
      // Use clipboard API to properly parse HTML into Delta format
      const delta = quill.clipboard.convert({ html: sanitized });
      quill.setContents(delta, 'silent');
    }

    return () => {
      // Don't clear ref - it needs to persist for StrictMode second render
      // The ref will be garbage collected when component truly unmounts
    };
  }, []);

  // Update content when value changes
  useEffect(() => {
    if (!quillRef.current) return;

    const sanitized = value ? sanitizeHtml(value) : "";

    // Use clipboard API to properly parse HTML into Delta format
    const delta = quillRef.current.clipboard.convert({ html: sanitized });
    quillRef.current.setContents(delta, 'silent');
  }, [value]);

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} mb={3}>
      {label && <FormLabel>{label}</FormLabel>}
      <Box
        border="1px"
        borderColor={error ? "red.500" : "gray.200"}
        borderRadius="md"
        overflow="hidden"
        _hover={{ borderColor: error ? "red.600" : "gray.300" }}
        sx={{
          "& .ql-container": {
            minHeight: height,
            fontSize: "14px",
          },
          "& .ql-editor": {
            minHeight: height,
          },
          "& .ql-toolbar": {
            borderBottom: "1px solid",
            borderColor: "gray.200",
            backgroundColor: "gray.50",
          },
          // Custom header labels
          "& .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before": {
            content: '"Heading"',
          },
          "& .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before": {
            content: '"Heading"',
          },
          "& .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before": {
            content: '"Sub Heading"',
          },
          "& .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before": {
            content: '"Sub Heading"',
          },
          // Content styling
          "& .ql-editor h2": {
            fontSize: "22px",
            fontWeight: 600,
            marginTop: 0,
            marginBottom: "15px",
          },
          "& .ql-editor h3": {
            fontSize: "18px",
            fontWeight: 600,
            marginTop: "30px",
            marginBottom: "15px",
          },
          "& .ql-editor h2:first-child, & .ql-editor h3:first-child": {
            marginTop: 0,
          },
          "& .ql-editor p": {
            marginBottom: "1rem",
            marginTop: 0,
          },
          "& .ql-editor p + ul, & .ql-editor p + ol": {
            marginTop: "0.5rem",
          },
          "& .ql-editor blockquote": {
            borderLeft: "none",
            backgroundColor: "#fafafa",
            padding: "50px",
            marginTop: "20px",
            marginBottom: "20px",
          },
          "& .ql-editor ul, & .ql-editor ol": {
            marginTop: 0,
            marginBottom: "1rem",
            paddingLeft: "1rem",
          },
          "& .ql-editor li": {
            lineHeight: 1.5,
            marginBottom: "0.125rem",
          },
        }}
      >
        <div ref={editorRef} />
      </Box>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default QuillEditor;
