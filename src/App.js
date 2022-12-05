import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Editor from './components/Editor';
import style from './App.module.scss';

function App() {
  return (
    <div className={style.app}>
      <BrowserRouter>
        <Routes>
          <Route path="/pages/:id" element={<Editor />} />
          <Route path="/pages" element={<Editor />} />
          <Route path="/" element={<Editor />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
