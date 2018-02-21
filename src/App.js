import React, { Component } from 'react';
import Plain from 'slate-plain-serializer';
// import ExportHTML from 'slate-html-serializer';
// import EditTable from 'slate-edit-table'

import { Editor } from 'slate-react'
import { Value } from 'slate'

import EditorData from './EditorData';

import logo from './logo.svg';
import './App.css';

console.log(EditorData);

const existingValue = JSON.parse(localStorage.getItem('content'));
const initialValue = Value.fromJSON(existingValue ||  EditorData );

function MarkHotkey(options) {
  const { type, key } = options
 
  return {
    onKeyDown(event, change) {
      if (!event.ctrlKey || event.key != key) return
      event.preventDefault()

      change.toggleMark(type)
      return true
    },
  }
}

// Plugins
const plugins = [
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: '`', type: 'code' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: 's', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' }),
]

class App extends Component {
  state = {
    value: initialValue,
  }
 
  onChange = ({ value }) => {
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
