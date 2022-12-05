import { useSelector, useDispatch } from 'react-redux';
import { addPage } from '../redux/reducer';

export default function Pages() {
  const pages = useSelector((state) => state.pages);
  const dispatch = useDispatch();
  return (
    <div className="pages">
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            { page.title }
          </li>
        ))}
      </ul>

      <button type="button" onClick={() => dispatch(addPage({ title: 'New Page' }))}>
        Add Page
      </button>
    </div>
  );
}
