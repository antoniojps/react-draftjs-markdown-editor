export default {
  options: ["inline", "blockType", "list"],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["bold", "strikethrough"]
  },
  blockType: {
    inDropdown: true,
    options: ["Normal", "H1", "H2", "H3", "H4", "Blockquote"],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["unordered"]
  },
  link: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: "_self",
    options: ["link", "unlink"],
    linkCallback: undefined
  },
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["undo", "redo"]
  }
};
