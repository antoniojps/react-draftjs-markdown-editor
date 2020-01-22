import React, { useState, useMemo } from "react";
import "./styles.css";
import RichTextEditorFromMarkdown from "./RichTextEditor/RichTextEditorFromMarkdown";
import { Remarkable } from 'remarkable';
import warningPlugin from "./RichTextEditor/remarkable/warningPlugin";
import carouselPlugin from "./RichTextEditor/remarkable/carouselPlugin";
import videoPlugin from "./RichTextEditor/remarkable/videoPlugin";

const defaultMarkdown = `
### Video
<video url="https://youtu.be/xtJTXa58rY8" />

### Warning
<warning>
This is a warning
</warning>


### Cat
![Cat](https://i.imgur.com/mF838iW.jpg)

### Carousel
<carousel>
carousel
</carousel>

hello
`

const md = new Remarkable();
md.use(warningPlugin)
  .use(videoPlugin)
  .use(carouselPlugin)

export default function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [initialMarkdown, setInitialMarkdown] = useState(defaultMarkdown);

  const handleChange = newMarkdown => {
    setMarkdown(newMarkdown);
  };

  const handleMarkdownLoad = () => {
    setInitialMarkdown(markdown)
  }

  const markdownToHTML = useMemo(() => md.render(markdown), [markdown])

  return (
    <div className="App">
      <h1>Testing remarkable plugins</h1>
      <p>The goal is creating a draft js markdown editor with custom syntax.</p>
      <p>What matters is the markdown to draft convertion to be succesfull, the rendering of the remarkable is not the goal here, the parser is.</p>
      <h3>RichTextEditor</h3>
      <RichTextEditorFromMarkdown
        initialMarkdown={initialMarkdown}
        onEditorStateChange={handleChange}
      />
      <div className="wrapper">
        <h3>Markdown</h3>
        <button onClick={handleMarkdownLoad} className="btn btn-default" style={{ marginBottom: "15px"}}>
          Convert markdown to draft
        </button>
        <textarea
          onChange={event => setMarkdown(event.target.value)}
          value={markdown}
        />
      </div>
      <div className="wrapper">
        <h3>Remarkable renderer</h3>
        <div className="renderer" dangerouslySetInnerHTML={{__html: markdownToHTML }} />
      </div>
    </div>
  );
}
