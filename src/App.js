import React, { Component } from 'react';
import { Editor } from 'slate-react'
import { Value } from 'slate'
import ExportHTML from 'slate-html-serializer';

// import EditTable from 'slate-edit-table'

import logo from './logo.svg';
import './App.css';

// Update the initial content to be pulled from Local Storage if it exists.
const existingValue = JSON.parse(localStorage.getItem('content'))
// Create our initial value...
const initialValue = Value.fromJSON(
  existingValue || {
    "document": {
      "nodes": [
        {
          "object": "block",
          "type": "paragraph",
          "nodes": [
            {
              "object": "text",
              "leaves": [
                {
                  "text": "Legend:",
                  "marks": [
                    {
                      "type": "bold"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "object": "block",
          "type": "paragraph",
          "nodes": [
            {
              "object": "text",
              "leaves": [
                {
                  "text": "Black text with gray highlights – represents the protocol template standard text. Please check and confirm if the text is applicable for this study. Whenever applicable, the standard text as provided in the template must be used without modification of the wording. If not applicable, the standard text should be removed (partially or completely) as needed. If these parts need modifications, please use Tracked change modus or comment bubbles."
                }
              ]
            }
          ]
        },
        {
          "object": "block",
          "type": "paragraph",
          "nodes": [
            {
              "object": "text",
              "leaves": [
                {
                  "text":
                  "Black text with yellow highlights – represents the part of protocol which should be replaced with study specific information.",
                  "marks": [
                    {
                      "type": "bold"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "object": "block",
          "type": "paragraph",
          "nodes": [
            {
              "object": "text",
              "leaves": [
                {
                  "text": "Green text – represent the COSprot generated standards coming from the Structured Study Design workbook (SSD wb). Changes to the green text need to be marked with the green highlighting or with a comment, so that those are updated in the SSD wb and not lost within the next COSprot protocol re-generation. These parts of protocol will be replaced with updated standards after each COSprot protocol creation and showed again as green text.After SSD wb update, standards will be generated and maintained in later CSP development points. CoE (Centre of Excellence) will do the modifications to SSD workbook, please mark needed modifications here with green highlighting or with comment bubbles."
                }
              ]
            }
          ]
        },
        {
          "object": "block",
          "type": "paragraph",
          "nodes": [
            {
              "object": "text",
              "leaves": [
                {
                  "text": "Any comments left on the green text would be lost during the COSprot protocol re-generation. Comments can be copied again manually after the generation process, but whenever possible please leave the comments on the black text or black text with gray highlights."
                }
              ]
            }
          ]
        },
        {
          "object": "block",
          "type": "paragraph",
          "nodes": [
            {
              "object": "text",
              "leaves": [
                {
                  "text": "Blue text",
                  "marks": [
                    {
                      "type": "italic"
                    }
                  ]
                },
                {
                  "text": " – represent the explanations and instructions for the CSP author. All blue text must be deleted upon CSP preparation."
                }
              ]
            }
          ]
        },
      ]
    }
  }
);

function MarkHotkey(options) {
  const { type, key } = options
 
  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, change) {
      // Check that the key pressed matches our `key` option.
      if (!event.ctrlKey || event.key != key) return
 
      // Prevent the default characters from being inserted.
      event.preventDefault()
 
      // Toggle the mark `type`.
      change.toggleMark(type)
      return true
    },
  }
}

// Initialize a plugin for each mark...
// Create an array of plugins.
const plugins = [
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: '`', type: 'code' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: '~', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' }),
]


class App extends Component {
  state = {
    value: initialValue,
  }
 
  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    // Save the value to Local Storage.
    if (value.document != this.state.value.document) {
      const content = JSON.stringify(value.toJSON());
      localStorage.setItem('content', content);
    }

    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    if (event.key != 'b' || !event.ctrlKey) return
    event.preventDefault()
    change.toggleMark('bold');
    return true
  }

  render() {
    return (
      <Editor
        className="editor"
        plugins={plugins}
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderMark={this.renderMark}
      />
    )
  }

  renderMark = props => {
    switch (props.mark.type) {
      case 'bold':
        return <strong>{props.children}</strong>
      // Add our new mark renderers...
      case 'code':
        return <code>{props.children}</code>
      case 'italic':
        return <em>{props.children}</em>
      case 'strikethrough':
        return <del>{props.children}</del>
      case 'underline':
        return <u>{props.children}</u>
    }
  }
}

export default App;
