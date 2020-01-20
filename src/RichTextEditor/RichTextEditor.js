/* eslint-disable no-unused-vars, no-console, react/prop-types, react/destructuring-assignment  */
/* Page for testing functions, components... */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import AtomicBlock from "./AtomicBlock";
import ToolbarOption from "./ToolbarOption";

import toolbarOptions from "./toolbarOptions";

const blockRenderFunc = contentBlock => {
  if (contentBlock.getType() !== "atomic") return null;

  const entityId = contentBlock.getEntityAt(0);

  return {
    component: AtomicBlock,
    editable: false
  };
};

const RichTextEditor = ({ editorState, onEditorStateChange }) => {
  useEffect(() => {
    console.log('converted', convertToRaw(editorState.getCurrentContent()))
  }, [editorState])
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      wrapperClassName="editor"
      toolbar={toolbarOptions}
      customBlockRenderFunc={blockRenderFunc}
      toolbarCustomButtons={[
        <ToolbarOption onChange={onEditorStateChange} editorState={editorState} />
      ]}
    />
  )
};

RichTextEditor.propTypes = {
  editorState: PropTypes.shape({}),
  onEditorStateChange: PropTypes.func
};

RichTextEditor.defaultProps = {
  editorState: EditorState.createEmpty(),
  onEditorStateChange: () => null
};

export default RichTextEditor;
