// Credit:
// https://github.com/orbiting/cms-draft/blob/fc6d509b61eb7fd0ad9429fae5e06fd11929c5f5/src/utils/markdown.js

const ImageRegexp = /^!\[([^\]]*)]\s*\(([^)"]+)( "([^)"]+)")?\)/
const imageBlock = (remarkable) => {
  remarkable.block.ruler.before('paragraph', 'image', (state, startLine, endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    if (pos >= max) {
      return false
    }
    if (!state.src) {
      return false
    }
    if (state.src[pos] !== '!') {
      return false
    }

    var match = ImageRegexp.exec(state.src.slice(pos))
    if (!match) {
      return false
    }

    // in silent mode it shouldn't output any tokens or modify pending
    if (!silent) {
      state.tokens.push({
        type: 'image_open',
        src: match[2],
        alt: match[1],
        lines: [ startLine, state.line ],
        level: state.level
      })

      state.tokens.push({
        type: 'image_close',
        level: state.level
      })
    }

    state.line = startLine + 1

    return true
  })
}

export default imageBlock