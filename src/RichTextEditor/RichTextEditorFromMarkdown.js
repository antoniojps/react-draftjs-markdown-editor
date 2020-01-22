/* eslint-disable no-unused-vars, no-console */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RichTextEditor from "./RichTextEditor";
import { EditorState, convertToRaw, convertFromRaw, CharacterMetadata,  ContentBlock, genKey, } from "draft-js";
import { draftToMarkdown } from "markdown-draft-js";
import markdownToDraft from './../markdownToDraft'
import warningPlugin from "./remarkable/warningPlugin";
import carouselPlugin from "./remarkable/carouselPlugin";
import imagePlugin from "./remarkable/imagePlugin";
import videoPlugin from "./remarkable/videoPlugin";

const RichTextEditorMarkdown = ({ initialMarkdown, onEditorStateChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // convert markdown to EditorState
  useEffect(() => {
    const rawDraftObj = markdownToDraft(initialMarkdown, {
      remarkablePlugins: [carouselPlugin, warningPlugin, imagePlugin, videoPlugin],
      blockTypes: {
        warning_open: function (item) {
          return {
            type: 'atomic',
            text: ' ',
          }
        },
        carousel_open: function (item) {
          return {
            type: 'atomic',
            text: ' ',
          }
        },
        image_open: function (item) {
          return {
            type: 'atomic',
            text: ' ',
          }
        },
        video_open: function (item) {
          return {
            type: 'atomic',
            text: ' ',
          }
        },
      },
      blockEntities: {
        warning_open: function (item) {
          return  {
            type: 'WARNING',
            mutability: 'IMMUTABLE',
            data: item.data
          }
        },
        carousel_open: function (item) {
          return  {
            type: 'CAROUSEL',
            mutability: 'IMMUTABLE',
          }
        },
        image_open: function (item) {
          return {
            type: 'IMAGE',
            mutability: 'IMMUTABLE',
            data: item
          }
        },
        video_open: function (item) {
          return  {
            type: 'VIDEO',
            mutability: 'IMMUTABLE',
            data: item
          }
        },
      }
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
          open: function (entity) {
            return ``;
          },
          close: function(entity) {
            return `
<warning>
  ${entity.data}
</warning>`;
          }
        },
        CAROUSEL: {
          open: function (entity) {
            return ``;
          },
          close: function (entity) {
            return `
<carousel>
  ![Image](https://www.ua.pt/contents/imgs/spaces/espacos_cantina_crasto_3.jpg)
</carousel>`;
          }
        },
        IMAGE: {
          open: function (entity) {
            return '';
          },
          close: function (entity) {
            return `![](${entity.data.src})`;
          }
        },
        VIDEO: {
          open: function (entity) {
            return '';
          },
          close: function (entity) {
            return `<video url="${entity.data.url}" />`;
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
