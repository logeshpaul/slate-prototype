import React, { Component } from 'react';
import { Editor, findNode } from 'slate-react'
import { Value, Block, Change, resetKeyGenerator, setKeyGenerator } from 'slate'
import EditorData from './EditorData';
import './App.css';

resetKeyGenerator();
const existingValue = JSON.parse(localStorage.getItem('content'));
const initialValue = Value.fromJSON(existingValue ||  EditorData );

// Helper
function MarkHotkey(options) {
  const { type, key } = options
 
  return {
    onKeyDown(event, change) {
      if (!event.ctrlKey || event.key !== key) return
      event.preventDefault()

      change.toggleMark(type)
      return true
    },
  }
}

// Plugins
const plugins = [
  MarkHotkey({ key: 'c', type: 'comment', data: Math.random() }),
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: '`', type: 'code' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: 's', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' }),
]

class App extends Component {
  state = {
    value: initialValue,
    commentList: [],
  }

  componentDidMount() {
    //setKeyGenerator(generator);
  }
 
  onChange = ({ value }) => {
    //console.log(value);
    if (value.document !== this.state.value.document) {
      const content = JSON.stringify(value.toJSON());
      localStorage.setItem('content', content);
    }
    this.setState({ value })
  }

  onKeyDown = (event, change, editor) => {
    //console.log(change.value.fragment.key);
    //const node = findNode(event.target)
    //console.log(node);

    const sampleNote = {
      "object":"text",
      "leaves":[
        {
          "object":"leaf",
          "text":"LP Title:",
          "marks":[
            {
              "object":"mark",
              "type":"bold",
              "data":{

              }
            }
          ]
        }
      ] 
    }

    // normalize: (change, reason, context) => {
    //   console.log("norm")
    //   if (reason === 'child_type_invalid') {
    //     const {child} = context;
    //     change.unwrapNodeByKey(child.key)
    //   }
    // }

    if (event.key !== 'b' || !event.ctrlKey) return
    event.preventDefault()
    change.toggleMark('bold');
    // added sampleNote to node 1
    //change.toggleMark('bold').insertNodeByKey('1', 1, sampleNote);

    if (event.key == 'Escape') {
      change.blur();
    }
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
    //console.log(props.node);

    switch (props.mark.type) {
      case 'comment':
        return <span id={props.node.key} className="comment">{props.children}</span>
        // return <span id={'_' + Math.random().toString(36).substr(2, 9)} className="comment">{props.children}</span>
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
      default: 
        return ''
    }
  }
}

export default App;
