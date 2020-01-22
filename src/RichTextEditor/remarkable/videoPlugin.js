// Credit:
// https://github.com/orbiting/cms-draft/blob/fc6d509b61eb7fd0ad9429fae5e06fd11929c5f5/src/utils/markdown.js


const TOKENS = {
  VIDEO: "video",
  VIDEO_OPEN: "video_open",
  VIDEO_CLOSE: "video_close"
};

/**
 * Remarkable block parser that recognizes callouts.
 * @todo Add options.
 */
export const parser = (state, startLine, endLine, silent) => {
  // position of line start in src + number of spaces used to indent it
  const pos = state.bMarks[startLine] + state.tShift[startLine]
  // position of line end in src
  const max = state.eMarks[startLine]

  if (pos >= max) return false
  if (!state.src) return false
  if (state.src[pos] !== '<') return false

  // check if enough chars for <video
  const tag = "<video";
  const tagNumberOfChars = tag.length;
  if (pos + tagNumberOfChars > max) return false;

  const lineText = state.src.slice(pos, max).trim();
  console.log({
    first: state.src[pos],
    pos,
    max,
    lineText
  })

  // check if is valid video element and get attributes
  const domParser = new DOMParser()
  const parsedHtml = domParser.parseFromString(lineText, 'text/html')
  const videoElement = parsedHtml.getElementsByTagName('video').item(0)
  const videoUrl = videoElement ? videoElement.getAttribute('url') : null

  if (!videoElement && !videoUrl) return false;

  // in silent mode it shouldn't output any tokens or modify pending
  if (!silent) {
    state.tokens.push({
      type: TOKENS.VIDEO_OPEN,
      url: videoUrl,
      lines: [ startLine, state.line ],
      level: state.level
    })

    state.tokens.push({
      type: TOKENS.VIDEO_CLOSE,
      level: state.level
    })
  }

  state.line = startLine + 1

  return true
}

/**
 * Remarkable open renderer.
 */
export function openRenderer(opts) {
  return (tokens, idx, options, env) => {
    const token = tokens[idx]
    const { url } =  token
    return `<div>Video url: ${url}`;
  }
}

/**
 * Callout closing tag renderer
 */
export function closeRenderer(opts) {
  return (tokens, idx, options, env) => "</div>";
}

const videoBlock = (md, opts) => {
  md.block.ruler.before('paragraph', TOKENS.VIDEO, parser, opts)
  md.renderer.rules[TOKENS.VIDEO_OPEN] = openRenderer(opts);
  md.renderer.rules[TOKENS.VIDEO_CLOSE] = closeRenderer(opts);
}

export default videoBlock