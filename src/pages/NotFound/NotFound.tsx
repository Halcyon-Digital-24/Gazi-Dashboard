// src/pages/NotFound.tsx
import React from 'react';
import CardBody from '../../components/card-body';
import { Link } from 'react-router-dom';
import "./index.scss"

const NotFound: React.FC = () => {
    return (
        <div>
            <CardBody header="Eror - 404" to="/" text='back' />
            <div className='content'>
                <img src="/assets/images/not-found.png" alt="" />
                <h1>404 Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <Link to="/"><button className='button-back-home'>Back To Home</button></Link>
            </div>
        </div>
    );
};

export default NotFound;
