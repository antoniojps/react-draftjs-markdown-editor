/* eslint-disable no-param-reassign */

const TOKENS = {
  WARNING: "warning",
  WARNING_OPEN: "warning_open",
  WARNING_CLOSE: "warning_close"
};

/**
 * Remarkable block parser that recognizes callouts.
 * @todo Add options.
 */
export const parser = (state, startLine, endLine, silent) => {
  // position of line start in src + number of spaces used to indent it
  const lineStart = state.bMarks[startLine] + state.tShift[startLine];
  // position of line end in src
  const lineEnd = state.eMarks[startLine];

  // check if line starts with '<'
  const tagMarker = state.src.charCodeAt(lineStart);

  // Wrong marker
  if (tagMarker !== 60 /* '<' */) return false;

  // check if enough chars for <tag>
  const tag = "<warning>";
  const tagNumberOfChars = tag.length;
  if (lineStart + tagNumberOfChars > lineEnd) return false;

  const lineText = state.src.slice(lineStart, lineEnd).trim();
  if (lineText !== tag) return false;

  if (silent) return true;

  // scan for tag ending
  let nextLine = startLine;
  let hasEnding = false;
  let insideText = ""
  const tagClosed = "</warning>";

  while (nextLine < endLine) {
    nextLine++;

    if (nextLine >= endLine) break;

    const nextLineStart = state.bMarks[nextLine] + state.tShift[nextLine];
    const nextLineEnd = state.eMarks[nextLine];
    const nextLineText = state.src.slice(nextLineStart, nextLineEnd).trim()

    if (state.src.charCodeAt(nextLineStart) !== tagMarker) {
      insideText = insideText !== '' ? insideText + "\n" + nextLineText : nextLineText
      continue;
    }
    if (nextLineText === tagClosed) {
      hasEnding = true;
      break;
    }
  }

  // Ensure nested parsing stops at delimiting block
  const oldMax = state.lineMax;
  state.lineMax = nextLine + (hasEnding ? -1 : 0);
  const oldParentType = state.parentType;
  state.parentType = "button";

  const lines = [startLine, 0];

  // Let register token and progress
  state.tokens.push({
    type: TOKENS.WARNING_OPEN,
    level: state.level,
    lines,
    data: insideText
  });
  // whether you wish to allow other blocks to be nested in your content or not.
  // HACK: removed to simplify markdown to draft conversion
  // state.parser.tokenize(state, startLine + 1, nextLine);
  state.tokens.push({
    type: TOKENS.WARNING_CLOSE,
    level: state.level,
  });

  // Revert
  lines[1] = nextLine;
  state.line = nextLine + (hasEnding ? 1 : 0);
  state.lineMax = oldMax;
  state.parentType = oldParentType;


  return true;
};

/**
 * Remarkable open renderer.
 */
export function openRenderer(opts) {
  return (tokens, idx, options, env) =>
    '<div style="background-color: red; padding: 1rem; border-radius: 15px; color: white;">';
}

/**
 * Callout closing tag renderer
 */
export function closeRenderer(opts) {
  return (tokens, idx, options, env) => "</div>";
}

const plugin = (md, opts) => {
  md.block.ruler.before("code", TOKENS.WARNING, parser, opts);
  md.renderer.rules[TOKENS.WARNING_OPEN] = openRenderer(opts);
  md.renderer.rules[TOKENS.WARNING_CLOSE] = closeRenderer(opts);
};

export default plugin;
