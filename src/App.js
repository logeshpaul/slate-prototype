import React, { Component } from "react";
import Html from "slate-html-serializer";
// import EditTable from 'slate-edit-table'
import { Editor } from "slate-react";
import EditorData from "./EditorData";
import "./App.css";

//const existingValue = JSON.parse(localStorage.getItem('content'));
const initialValue = localStorage.getItem("content") || "";

function MarkHotkey(options) {
  const { type, key } = options;
  return {
    onKeyDown(event, change) {
      if (!event.ctrlKey || event.key != key) return;
      event.preventDefault();

      change.toggleMark(type);
      return true;
    }
  };
}

// Plugins
const plugins = [
  MarkHotkey({ key: "b", type: "bold" }),
  MarkHotkey({ key: "`", type: "code" }),
  MarkHotkey({ key: "i", type: "italic" }),
  MarkHotkey({ key: "s", type: "strikethrough" }),
  MarkHotkey({ key: "u", type: "underline" })
];

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: "italic",
  strong: "bold",
  u: "underline"
};

// Refactor block tags into a dictionary for cleanliness.
const BLOCK_TAGS = {
  p: "paragraph",
  blockquote: "quote",
  pre: "code"
};

const rules = [
  {
    // Switch deserialize to handle more blocks...
    deserialize(el, next) {
      console.log(el.id);
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (!type) return;
      return {
        object: "block",
        type: type,
        nodes: next(el.childNodes)
      };
    },
    // Switch serialize to handle more blocks...
    serialize(obj, children) {
      if (obj.object != "block") return;
      switch (obj.type) {
        case "paragraph":
          return <p id={Math.random()}>{children}</p>;
        case "quote":
          return <blockquote>{children}</blockquote>;
        case "code":
          return (
            <pre>
              <code>{children}</code>
            </pre>
          );
      }
    }
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (!type) return;
      return {
        object: "mark",
        type: type,
        nodes: next(el.childNodes)
      };
    },
    serialize(obj, children) {
      if (obj.object != "mark") return;
      switch (obj.type) {
        case "bold":
          return <strong>{children}</strong>;
        case "italic":
          return <em>{children}</em>;
        case "underline":
          return <u>{children}</u>;
        case "code":
          return (
            <pre>
              <code>{children}</code>
            </pre>
          );
      }
    }
  }
];

// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules });

class App extends Component {
  state = {
    value: html.deserialize(initialValue)
  };
  onChange = ({ value }) => {
    if (value.document != this.state.value.document) {
      const content = html.serialize(value);
      localStorage.setItem("content", content);
    }

    this.setState({ value });
  };

  onKeyDown = (event, change) => {
    if (event.key != "b" || !event.ctrlKey) return;
    event.preventDefault();
    change.toggleMark("bold");
    return true;
  };

  render() {
    return (
      <Editor
        className="editor"
        plugins={plugins}
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    );
  }

  renderNode = props => {
    switch (props.node.type) {
      case "code":
        return (
          <pre {...props.attributes}>
            <code>{props.children}</code>
          </pre>
        );
      case "paragraph":
        return <p {...props.attributes}>{props.children}</p>;
      case "quote":
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
    }
  };

  renderMark = props => {
    switch (props.mark.type) {
      case "bold":
        return <strong>{props.children}</strong>;
      case "code":
        return <code>{props.children}</code>;
      case "italic":
        return <em>{props.children}</em>;
      case "underline":
        return <u>{props.children}</u>;
    }
  };
}

export default App;