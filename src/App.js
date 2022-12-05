import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Editor from './components/Editor';
import style from './App.module.scss';
import Error404 from './components/Error404';

function App() {
  return (
    <div className={style.app}>
      <BrowserRouter>
        <Routes>
          <Route path="/pages/:id" element={<Editor />} />
          <Route path="/pages" element={<Editor />} />
          <Route path="/" element={<Editor />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
