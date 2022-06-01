import { useState, useEffect, RefCallback } from 'react'
import { Editor, editorViewCtx, rootCtx } from '@milkdown/core'

type GetEditor = (container: HTMLDivElement) => Editor | undefined

type UseEditorReturn<T extends HTMLElement> =
  | {
      loaded: false
      rootRef: RefCallback<T>
      editor: null
    }
  | {
      loaded: true
      rootRef: RefCallback<T>
      editor: Editor
    }

export const useEditor = <T extends HTMLElement = HTMLElement>(
  getEditor: GetEditor,
  deps?: React.DependencyList | undefined,
): UseEditorReturn<T> => {
  const [rootRef, setRootRef] = useState<T>()
  const [editorRef, setEditorRef] = useState<Editor | null>()

  useEffect(() => {
    if (!rootRef) return

    // create the host element
    const node = document.createElement('div')
    rootRef.appendChild(node)

    // create the editor
    const baseEditor = getEditor(node)

    // if no editor, return and remove child node
    if (!baseEditor) {
      rootRef.removeChild(node)
      return
    }

    // create a generic destructor function to call
    let destroyEditor: () => void = () => {
      const view = baseEditor.action(ctx => ctx.get(editorViewCtx))
      const root = baseEditor.action(ctx => ctx.get(rootCtx)) as HTMLElement
      rootRef?.removeChild(root)
      view?.destroy()
    }

    const editorPromise = baseEditor
      .create()
      .then(editor => {
        // The way to destroy an editor
        const destroyEditorFn = () => {
          const view = editor.action(ctx => ctx.get(editorViewCtx))
          const root = editor.action(ctx => ctx.get(rootCtx)) as HTMLElement
          rootRef?.removeChild(root)
          view?.destroy()
        }

        setEditorRef(editor)
        destroyEditor = destroyEditorFn
      })
      .catch(console.error)

    return () => {
      destroyEditor()
      setEditorRef(null)
    }
  }, [rootRef, ...(deps ?? [])])

  if (!editorRef) {
    return {
      loaded: false,
      rootRef: setRootRef as RefCallback<T>,
      editor: null,
    }
  } else {
    return {
      loaded: true,
      rootRef: setRootRef as RefCallback<T>,
      editor: editorRef,
    }
  }
}
