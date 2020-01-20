import React, { useState, useRef } from "react";
import { EditorState, AtomicBlockUtils,   BlockMapBuilder,
  CharacterMetadata,
  ContentBlock,
  Modifier,
  genKey } from "draft-js";
import PropTypes from "prop-types";
import { useToggle, useClickAway } from "react-use";
import styled from "styled-components";

import { List, Repeat } from 'immutable'

const insertAtomicBlockWithData = (editorState, entityKey, blockData, character) => {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()

  const afterRemovalContentState = Modifier.removeRange(
    contentState,
    selectionState,
    'backwarad'
  )

  const targetSelectionState = afterRemovalContentState.getSelectionAfter()
  const afterSplitContentState = Modifier.splitBlock(afterRemovalContentState, targetSelectionState)
  const insertionTarget = afterSplitContentState.getSelectionAfter()

  const asAtomicBlock = Modifier.setBlockType(
    afterSplitContentState,
    insertionTarget,
    'atomic'
  )

  const charData = CharacterMetadata.create({ entity: entityKey })

  const fragmentArray = [
    new ContentBlock({
      key: genKey(),
      type: 'atomic',
      text: character,
      characterList: List(Repeat(charData, character.length)),
      data: blockData
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '',
      characterList: List()
    })
  ]

  const fragment = BlockMapBuilder.createFromArray(fragmentArray)

  const withAtomicBlock = Modifier.replaceWithFragment(
    asAtomicBlock,
    insertionTarget, fragment
  )

  const newContentState = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true)
  })

  return EditorState.push(editorState, newContentState, 'insert-fragment')
}

// generates markdown text by type of entity
const generateTextByBlockType = (type, data) => {
  if (type === 'CAROUSEL') {
    const carousel = `
<carousel>
  ${data.children}
</carousel>`
    return carousel
  }
  return ' '
}

const insertBlock = (editorState, onChange, data) => {
  const { type, props } = data
  const text = generateTextByBlockType(type, props)

  const newEditorStateWithBlock = insertAtomicBlockWithData(
    editorState,
    null,
    data,
    text,
  );
  onChange(newEditorStateWithBlock);
};

export const ToolbarOption = ({ onChange, editorState, initialValues }) => {
  const [isOpen, toggle] = useToggle();
  const [value, setValue] = useState();

  const ref = useRef(null);
  useClickAway(ref, () => {
    if (isOpen) toggle();
  });

  const handleClick = () => {
    toggle();
  };

  const addBlock = () => {
    toggle();
    insertBlock(editorState, onChange, { type: "WARNING", props: { children: value } });
  };

  return (
    <>
      <div className="rdw-list-wrapper">
        <button onClick={handleClick}>Add Warning</button>
      </div>
      {isOpen && (
        <Modal ref={ref}>
          <input
            type="text"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
          <button onClick={addBlock}>Add</button>
        </Modal>
      )}
    </>
  );
};

const Modal = styled.div`
  position: absolute;
  left: 270px;
  top: 70px;
  width: auto;
  height: auto;
  padding: 1rem;
  background-color: white;
  border: 4px solid red;
`;

ToolbarOption.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorState: PropTypes.shape({}).isRequired,
  initialValues: PropTypes.shape({})
};

ToolbarOption.defaultProps = {
  initialValues: {}
};

export default ToolbarOption;
