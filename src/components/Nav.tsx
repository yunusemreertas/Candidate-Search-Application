import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul className="navigation">
        <li>
          <Link to="/">User Search</Link>
        </li>
        <li>
          <Link to="/SavedCandidates">Saved Candidates</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
