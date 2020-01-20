import React, { useState } from "react";
import "./styles.css";
import RichTextEditorFromMarkdown from "./RichTextEditor/RichTextEditorFromMarkdown";

export default function App() {
  const [markdown, setMarkdown] = useState("");
  const [initialMarkdown, setInitialMarkdown] = useState("");

  const handleChange = newMarkdown => {
    setMarkdown(newMarkdown);
  };

  return (
    <div className="App">
      <h1>RichTextEditor</h1>
      <RichTextEditorFromMarkdown
        initialMarkdown={initialMarkdown}
        onEditorStateChange={handleChange}
      />
      <h1>Markdown</h1>
      <button onClick={() => setInitialMarkdown(markdown)}>
        Convert markdown to draft
      </button>
      <textarea
        onChange={event => setMarkdown(event.target.value)}
        value={markdown}
      />
    </div>
  );
}
