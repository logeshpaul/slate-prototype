import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { type Node } from 'slate';
import { Editor } from 'slate-react';
import { Value } from 'slate'

import EditTable from 'slate-edit-table';
import PluginEditTable from 'slate-edit-table';

import INITIAL_VALUE from './value';

import './App.css';

const tablePlugin = PluginEditTable();
const plugins = [tablePlugin];

type NodeProps = {
  attributes: Object,
  node: Node,
  children: React.Node
};

function renderNode(props: NodeProps): React.Node {
  const { node, attributes, children } = props;
  let textAlign;

  switch (node.type) {
      case 'table':
          return (
              <table>
                  <tbody {...attributes}>{children}</tbody>
              </table>
          );
      case 'table_row':
          return <tr {...attributes}>{children}</tr>;
      case 'table_cell':
          textAlign = node.get('data').get('textAlign');
          textAlign =
              ['left', 'right', 'center'].indexOf(textAlign) === -1
                  ? 'left'
                  : textAlign;
          return (
              <td style={{ textAlign }} {...attributes}>
                  {children}
              </td>
          );
      case 'paragraph':
          return <p {...attributes}>{children}</p>;
      case 'heading':
          return <h1 {...attributes}>{children}</h1>;
      default:
          return null;
  }
}

class App extends Component {
  submitChange: Function;
    editorREF: Editor;
    state = {
        value: INITIAL_VALUE
    };

  renderTableToolbar() {
    return (
        <div>
            <button onMouseDown={this.onInsertColumn}>Insert Column</button>
            <button onMouseDown={this.onInsertRow}>Insert Row</button>
            <button onMouseDown={this.onRemoveColumn}>Remove Column</button>
            <button onMouseDown={this.onRemoveRow}>Remove Row</button>
            <button onMouseDown={this.onRemoveTable}>Remove Table</button>
            <br />
            <button onMouseDown={e => this.onSetAlign(e, 'left')}>
                Set align left
            </button>
            <button onMouseDown={e => this.onSetAlign(e, 'center')}>
                Set align center
            </button>
            <button onMouseDown={e => this.onSetAlign(e, 'right')}>
                Set align right
            </button>
        </div>
    );
}

renderNormalToolbar() {
    return (
        <div>
            <button onClick={this.onInsertTable}>Insert Table</button>
        </div>
    );
}
setEditorComponent = (ref: Editor) => {
    this.editorREF = ref;
    this.submitChange = ref.change;
};

onChange = ({ value }) => {
    this.setState({
        value
    });
};

onInsertTable = event => {
    event.preventDefault();
    this.submitChange(tablePlugin.changes.insertTable);
};

onInsertColumn = event => {
    event.preventDefault();
    this.submitChange(tablePlugin.changes.insertColumn);
};

onInsertRow = event => {
    event.preventDefault();
    this.submitChange(tablePlugin.changes.insertRow);
};

onRemoveColumn = event => {
    event.preventDefault();
    this.submitChange(tablePlugin.changes.removeColumn);
};

onRemoveRow = event => {
    event.preventDefault();
    this.submitChange(tablePlugin.changes.removeRow);
};

onRemoveTable = event => {
    event.preventDefault();
    this.submitChange(tablePlugin.changes.removeTable);
};

onSetAlign = (event, align) => {
    event.preventDefault();
    this.submitChange(tablePlugin.changes.setColumnAlign, align);
};

  render() {
    const { value } = this.state;
    const isInTable = tablePlugin.utils.isSelectionInTable(value);
    const isOutTable = tablePlugin.utils.isSelectionOutOfTable(value);

    return (
      <div>
        {isInTable ? this.renderTableToolbar() : null}
        {isOutTable ? this.renderNormalToolbar() : null}
        <Editor
            ref={this.setEditorComponent}
            placeholder={'Enter some text...'}
            renderNode={renderNode}
            plugins={plugins}
            value={value}
            onChange={this.onChange}
        />
    </div>
    )
  }
}

export default App;
