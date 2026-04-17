# QuillEditor Component

A reusable WYSIWYG editor component built with Quill.js for use in Refine forms.

## Features

- Clean, accessible interface for non-technical users
- HTML output (compatible with existing database storage)
- Integrated with Chakra UI form controls
- React Hook Form compatible
- Customizable toolbar and height
- Proper error handling and validation

## Basic Usage

```tsx
import QuillEditor from "@/components/quill-editor";

// Simple usage
<QuillEditor
  value={content}
  onChange={(html) => setContent(html)}
  placeholder="Enter your content..."
/>
```

## With Refine Forms (react-hook-form)

```tsx
import { useForm } from "@refinedev/react-hook-form";
import QuillEditor from "@/components/quill-editor";

export const ArticleEdit = () => {
  const {
    refineCore: { formLoading },
    saveButtonProps,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const content = watch("content");

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box as="form">
        {/* Other form fields */}

        <QuillEditor
          label="Content"
          value={content}
          onChange={(html) => setValue("content", html)}
          error={errors.content?.message as string}
          isRequired
          height="400px"
        />

        {/* Other form fields */}
      </Box>
    </Edit>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | HTML content value |
| `onChange` | `(value: string) => void` | - | Callback fired when content changes |
| `placeholder` | `string` | `"Enter content..."` | Placeholder text |
| `label` | `string` | - | Form label |
| `error` | `string` | - | Error message to display |
| `isRequired` | `boolean` | `false` | Mark field as required |
| `height` | `string` | `"300px"` | Editor height |

## Toolbar Features

The editor includes the following toolbar options:

- **Text Formatting:** Bold, Italic, Underline, Strikethrough
- **Headers:** H2, H3, Normal text
- **Block Formatting:** Blockquotes
- **Lists:** Ordered and unordered lists
- **Alignment:** Left, Center, Right
- **Links:** Add/remove hyperlinks
- **Clean:** Remove all formatting

## Accessibility

The editor is built with accessibility in mind:
- Semantic HTML output
- Keyboard navigation support
- Screen reader compatible
- Clear visual feedback for focus and errors
- Proper ARIA labels via Chakra UI

## Sanitization

**Important:** While the editor restricts toolbar options, you should still sanitize HTML on the backend before storing it in the database. The editor only limits what users can create via the toolbar, but doesn't prevent pasting of arbitrary HTML.

## Examples

### With Validation

```tsx
<QuillEditor
  label="Article Content"
  value={content}
  onChange={(html) => setValue("content", html)}
  error={errors.content?.message as string}
  isRequired
  placeholder="Write your article content here..."
/>
```

### Custom Height

```tsx
<QuillEditor
  label="Description"
  value={description}
  onChange={(html) => setDescription(html)}
  height="200px"
  placeholder="Brief description..."
/>
```

### Standalone (No Label)

```tsx
<QuillEditor
  value={content}
  onChange={(html) => setContent(html)}
  placeholder="Start typing..."
/>
```
