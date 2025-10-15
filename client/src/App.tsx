import { Editor } from './components/Editor';
import './components/editor.css';
export default function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Cadmus Collaborative Editor</h1>
      <Editor />
    </div>
  );
}
