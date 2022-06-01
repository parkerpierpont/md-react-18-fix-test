import { Editor, rootCtx, defaultValueCtx, Ctx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { ReactEditor } from '@milkdown/react'
import { gfm } from '@milkdown/preset-gfm'
import defaultValue from './default-value.md?raw'
import { useEditor } from './useEditor'

const MilkdownEditor = () => {
  const { loaded, editor, rootRef } = useEditor(
    root =>
      Editor.make()
        .config(ctx => {
          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, defaultValue)
        })
        .use(gfm)
        .use(nord),
    [],
  )

  return (
    <>
      {!loaded && <div>Loading...</div>}
      <div ref={rootRef} />
    </>
  )
}

export default MilkdownEditor
