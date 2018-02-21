import React, { Component } from 'react';
//import ExportHTML from 'slate-html-serializer';

import { Editor } from 'slate-react'
import { Value } from 'slate'
import EditorData from './EditorData';


// import EditTable from 'slate-edit-table'

import logo from './logo.svg';
import './App.css';

// Update the initial content to be pulled from Local Storage if it exists.
const existingValue = JSON.parse(localStorage.getItem('content'))
// Create our initial value...
const initialValue = Value.fromJSON(
  existingValue ||  EditorData );

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
