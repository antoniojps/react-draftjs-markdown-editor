/* eslint-disable no-unused-vars, no-console */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RichTextEditor from "./RichTextEditor";
import { EditorState, convertToRaw, convertFromRaw, CharacterMetadata,  ContentBlock, genKey, } from "draft-js";
import { List, Map, Repeat } from 'immutable'
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
import remarkablePlugin from "./remarkablePlugin";

const RichTextEditorMarkdown = ({ initialMarkdown, onEditorStateChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // convert markdown to EditorState
  useEffect(() => {
    const rawDraftObj = markdownToDraft(initialMarkdown, {
      remarkablePlugins: [remarkablePlugin],
      blockTypes: {
        warning_open: function (item) {
          return {
            type: 'atomic',
            data: {
              type: 'WARNING',
              props: item.props
            },
            text: ' ',
          }
        }
      },
    });
    const newContentState = convertFromRaw(rawDraftObj);
    const newEditorState = EditorState.createWithContent(newContentState);
    const fixSelection = EditorState.moveSelectionToEnd(newEditorState);
    setEditorState(fixSelection);
  }, [initialMarkdown]);

  // convert EditorState to markdown
  const handleChange = newEditorState => {
    const contentState = newEditorState.getCurrentContent();
    const rawDraftObj = convertToRaw(contentState);
    const markdownFromEditorState = draftToMarkdown(rawDraftObj, {
      entityItems: {
        WARNING: {
          open: function(entity) {
            return ``;
          },
          close: function(entity) {
            return `
<warning>
  ${entity.data}
</warning>`;
          }
        }
      }
    });

    setEditorState(newEditorState);
    onEditorStateChange(markdownFromEditorState);
  };

  return (
    <RichTextEditor
      editorState={editorState}
      onEditorStateChange={handleChange}
    />
  );
};

RichTextEditorMarkdown.propTypes = {
  editorState: PropTypes.shape({}),
  initialMarkdown: PropTypes.string,
  onEditorStateChange: PropTypes.func
};

RichTextEditorMarkdown.defaultProps = {
  editorState: EditorState.createEmpty(),
  initialMarkdown: "",
  onEditorStateChange: () => null
};

export default RichTextEditorMarkdown;
