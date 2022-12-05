import { NavLink } from 'react-router-dom';
import style from './Error404.module.scss';

export default function Error404() {
  return (
    <div className={style.div}>
      <h1>ERROR 404</h1>
      <h2>
        Page not found. Click here to go to the
        {' '}
        <NavLink to="/"> home page</NavLink>
        .
      </h2>
    </div>
  );
}
