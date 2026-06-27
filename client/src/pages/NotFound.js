import { Link } from 'react-router-dom';
import Icon from '../components/common/Icon';
import { icons } from '../config/icons';

const NotFound = () => {
    return (
    <div className='notfound-page'>
        <div className='notfound-wrap'>
            <div className='icon'><Icon icon={icons.warning} /></div>
            <h1>404</h1>
            <h3>Page Not Found</h3>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className="button">Go to Homepage</Link>
        </div>
    </div>);
};

export default NotFound;