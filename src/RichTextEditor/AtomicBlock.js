import React from "react";
import PropTypes from "prop-types";

const Warning = props => (
  <div
    style={{ padding: "1rem", backgroundColor: "red" }}
  >
    {props.children}
  </div>
);

const AtomicBlock = ({ block, contentState }) => {
  // get block entity data
  const entity = contentState.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  // render appropriate component based on atomic block entity type
  switch (type) {
    case "WARNING":
      return <Warning>{data}</Warning>;
    default:
      return "Invalid AtomicBlock type";
  }
};

AtomicBlock.propTypes = {
  block: PropTypes.shape({}).isRequired,
  contentState: PropTypes.shape({}).isRequired
};

export default AtomicBlock;
