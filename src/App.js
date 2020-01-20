import React, { useState } from "react";
import "./styles.css";
import RichTextEditorFromMarkdown from "./RichTextEditor/RichTextEditorFromMarkdown";

const defaultMarkdown = `
# Hello world

how **you** doing?
`

export default function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [initialMarkdown, setInitialMarkdown] = useState(defaultMarkdown);

  const handleChange = newMarkdown => {
    setMarkdown(newMarkdown);
  };

  const handleMarkdownLoad = () => {
    setInitialMarkdown(markdown)
  }

  console.log({initialMarkdown})
  return (
    <div className="App">
      <h1>RichTextEditor</h1>
      <RichTextEditorFromMarkdown
        initialMarkdown={initialMarkdown}
        onEditorStateChange={handleChange}
      />
      <h1>Markdown</h1>
      <button onClick={handleMarkdownLoad} className="btn btn-default" style={{ marginBottom: "15px"}}>
        Convert markdown to draft
      </button>
      <textarea
        onChange={event => setMarkdown(event.target.value)}
        value={markdown}
      />
    </div>
  );
}
