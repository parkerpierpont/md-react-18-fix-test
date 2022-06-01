import { createNode } from '@milkdown/utils'
import figmaToken from 'config/figma-token'

export const figmaImage = async ({
  fileKey,
  nodeId,
}: {
  fileKey: string
  nodeId: string
}) => {
  const url = new URL(`https://api.figma.com/v1/images/${fileKey}`)
  url.searchParams.set('ids', encodeURIComponent(nodeId))
  url.searchParams.set('format', 'svg')
  const result = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-FIGMA-TOKEN': figmaToken,
    },
  })

  return result
}

export const parseFigmaUrl = (
  figmaUrl: string,
): null | { fileKey: string; nodeId: string } => {
  // example: https://www.figma.com/file/XMq2UFxRexlBqKlqHvmbsb/Bot?node-id=2%3A2
  const url = new URL(figmaUrl)
  let filenameSplit = url.pathname.split('/')
  // must start with `/file`
  if (filenameSplit[1] !== 'file') return null
  // we should now be able to get the filename key
  const fileKey = filenameSplit[2]
  // we want the node-id of the frame we want to download an image for...
  const nodeId = url.searchParams.get('node-id')
  if (!nodeId) return null
  return { fileKey, nodeId }
}

// export const figma = createNode(() => {
//   const id = 'figma-example'

//   return {
//     id,
//     schema: () => ({
//       content: 'block+',
//       group: 'block',
//       defining: true,
//       atom: true,
//       attrs: {
//         src: {
//           default:
//             'https://www.figma.com/file/XMq2UFxRexlBqKlqHvmbsb/Bot?node-id=2%3A2',
//         },
//         height: { default: '450' },
//         width: { default: '100%' },
//       },
//       parseDOM: [
//         { tag: 'iframe' },
//         {
//           attrs: { class: 'figma-embed' },
//           getAttrs: node => {
//             if (typeof node === 'string') return null
//             const hasClassName = node.classList.contains('figma-embed')
//             if (!hasClassName) return null
//             const height = node.attributes.getNamedItem('height')
//             const width = node.attributes.getNamedItem('width')
//             const src = node.attributes.getNamedItem('src')
//             return { height, width, src }
//           },
//         },
//       ],
//       toDOM(node) {
//         const el = document.createElement('iframe')
//         el.setAttribute('height', String(node.attrs.height ?? 450))
//         el.setAttribute('width', String(node.attrs.width ?? '100%'))
//         el.setAttribute('src', node.attrs.source)
//         return el
//       },
//       toMarkdown: {
//         match: node => node.type.name === id,
//         runner: (state, node) => {
//           state.openNode(id).closeNode()
//         },
//       },
//     }),
//   }
// })
