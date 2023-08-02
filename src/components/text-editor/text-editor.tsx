import { z } from 'zod'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useCallback, useEffect } from 'react'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import { UseFormReturn } from 'react-hook-form'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, CopyX, Heading2, Heading3, Heading4, Heading5, Heading6, ImageIcon, Italic, Link2Icon, Link2OffIcon, List, ListOrdered, ListRestart, Pilcrow, Quote, Redo2, UnderlineIcon, Undo2, WrapText } from 'lucide-react'
import { FormSchema } from '@/pages/dashboard/article/create'

const iconsStyles = "w-5 h-5"
const Active = 'is-active bg-black dark:bg-white text-white dark:text-black'
const NormalStyles =
  'px-1 py-1 hover:bg-black hover:dark:bg-white hover:text-white dark:hover:text-black rounded-md h-auto border'

const MenuBar = ({ editor, className }: { editor: any, className: string }) => {
  const addImage = useCallback(() => {
    const url = window.prompt('Image URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <>
      <div className={`${className} relative`}>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${editor.isActive('bold') ? Active : ''} ${NormalStyles}`}
        >
          <Bold className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${editor.isActive('italic') ? Active : ''
            } ${NormalStyles}`}
        >
          <Italic className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${editor.isActive('underline') ? Active : ''
            } ${NormalStyles}`}
        >
          <UnderlineIcon className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`${editor.isActive({ textAlign: 'left' }) ? Active : ''
            } ${NormalStyles}`}
        >
          <AlignLeft className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`${editor.isActive({ textAlign: 'center' }) ? Active : ''
            } ${NormalStyles}`}
        >
          <AlignCenter className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`${editor.isActive({ textAlign: 'right' }) ? Active : ''
            } ${NormalStyles}`}
        >
          <AlignRight className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`${editor.isActive({ textAlign: 'justify' }) ? Active : ''
            } ${NormalStyles}`}
        >
          <AlignJustify className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={setLink}
          className={`${editor.isActive('link') ? Active : ''} ${NormalStyles}`}
        >
          <Link2Icon className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className={`${!editor.isActive('link') ? Active : ''
            } ${NormalStyles}`}
        >
          <Link2OffIcon className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className={NormalStyles}
        >
          <ListRestart className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().clearNodes().run()}
          className={NormalStyles}
        >
          <CopyX />
        </button>

        <button type='button' onClick={addImage} className={NormalStyles}>
          <ImageIcon className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`${editor.isActive('paragraph') ? Active : ''
            } ${NormalStyles}`}
        >
          <Pilcrow className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${editor.isActive('heading', { level: 2 }) ? Active : ''
            } ${NormalStyles}`}
        >
          <Heading2 className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${editor.isActive('heading', { level: 3 }) ? Active : ''
            } ${NormalStyles}`}
        >
          <Heading3 className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`${editor.isActive('heading', { level: 4 }) ? Active : ''
            } ${NormalStyles}`}
        >
          <Heading4 className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={`${editor.isActive('heading', { level: 5 }) ? Active : ''
            } ${NormalStyles}`}
        >
          <Heading5 className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={`${editor.isActive('heading', { level: 6 }) ? Active : ''
            } ${NormalStyles}`}
        >
          <Heading6 className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${editor.isActive('bulletList') ? Active : ''
            } ${NormalStyles}`}
        >
          <List className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${editor.isActive('orderedList') ? Active : ''
            } ${NormalStyles}`}
        >
          <ListOrdered className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${editor.isActive('blockquote') ? Active : ''
            } ${NormalStyles}`}
        >
          <Quote className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={NormalStyles}
        >
          <WrapText className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().undo().run()}
          className={NormalStyles}
        >
          <Undo2 className={iconsStyles} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().redo().run()}
          className={NormalStyles}
        >
          <Redo2 className={iconsStyles} />
        </button>
      </div>
    </>
  )
}

const Editor = ({ form }: { form: UseFormReturn<z.infer<typeof FormSchema>> }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Link.configure({
        openOnClick: false
      })
    ],
    content: '',
    onUpdate({ editor }) {
      form.setValue('body', editor.getHTML())
    }
  })

  useEffect(() => {
    // This effect runs only in the browser environment
    const contentFromLocalStorage = localStorage.getItem('content');
    if (contentFromLocalStorage) {
      editor?.commands?.setContent(JSON.parse(contentFromLocalStorage));
    } else {
      editor?.commands?.setContent('<p>Start writing your article.</p>');
    }
  }, [editor]);

  return (
    <div className='w-full relative rounded outline-none'>
      <MenuBar
        editor={editor}
        className='flex flex-row gap-1 sticky top-[60px] shadow z-50 flex-wrap items-start py-1 px-2 bg-background h-auto rounded-t w-full'
      />
      <EditorContent
        editor={editor}
        className='relative rounded bg-background min-h-[400px] border-none article p-1'
      />
    </div>
  )
}

export default Editor