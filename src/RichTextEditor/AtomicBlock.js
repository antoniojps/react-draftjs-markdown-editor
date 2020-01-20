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
  const data = block.getData().toJS()
  const {type, props}= data

  switch (type) {
    case "WARNING":
      return <Warning {...props} />;
    default:
      return "Invalid AtomicBlock type";
  }
};

AtomicBlock.propTypes = {
  block: PropTypes.shape({}).isRequired,
  contentState: PropTypes.shape({}).isRequired
};

export default AtomicBlock;
