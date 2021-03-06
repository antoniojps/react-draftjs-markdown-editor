import React, { useState, useRef } from "react";
import { EditorState, AtomicBlockUtils } from "draft-js";
import PropTypes from "prop-types";
import { useToggle, useClickAway } from "react-use";
import styled from "styled-components";

const insertBlock = (editorState, onChange, { type, data }) => {
    // create an entity
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      type,
      'IMMUTABLE',
      data,
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity }
    );

    // insert a new atomic block with entity metadata
    const text = " "
    const newEditorStateWithBlock = AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      text
    );
    onChange(newEditorStateWithBlock)
}


export const ToolbarOption = ({ onChange, editorState, initialValues }) => {
  const [isOpen, toggle] = useToggle();
  const [value, setValue] = useState("");

  const ref = useRef(null);
  useClickAway(ref, () => {
    if (isOpen) toggle();
  });

  const handleClick = () => {
    toggle();
  };

  const addWarning = () => {
    toggle();
    insertBlock(editorState, onChange, { type: 'WARNING', data: value })
  };

  const addCarousel = () => {
    insertBlock(editorState, onChange, { type: 'CAROUSEL' })
  };

  const addImage = () => {
    insertBlock(editorState, onChange, { type: 'IMAGE', data: {src: "https://i.imgur.com/AbL5Ivo.jpg"}  })
  };

  const addVideo = () => {
    insertBlock(editorState, onChange, { type: 'VIDEO', data: {url: "https://youtu.be/xtJTXa58rY8"}  })
  };

  return (
    <>
      <div className="rdw-list-wrapper">
        <button onClick={handleClick}>Add Warning</button>
      </div>
      <div className="rdw-list-wrapper">
        <button onClick={addCarousel}>Add Carousel</button>
      </div>
      <div className="rdw-list-wrapper">
        <button onClick={addImage}>Add image</button>
      </div>
      <div className="rdw-list-wrapper">
        <button onClick={addVideo}>Add video</button>
      </div>
      {isOpen && (
        <Modal ref={ref}>
          <input
            type="text"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
          <button onClick={addWarning}>Add</button>
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
