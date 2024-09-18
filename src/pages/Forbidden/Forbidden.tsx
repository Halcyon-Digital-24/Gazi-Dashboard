// Forbidden.tsx
import React from "react";
import CardBody from "../../components/card-body";
import { Link } from "react-router-dom";
import './index.scss'

const Forbidden: React.FC = () => {
    return (
        <div>
            <CardBody header="Forbidden - 403" to="/" text="back"/>
            <div className='content'>
                <h1>403 - Forbidden</h1>
                <p>You do not have permission to view this page.</p>
                <img className="forbidden-img" src="/assets/images/forbidden.jpg" alt="" />
                <br />
                <Link to="/"><button className='button-back-home'>Back To Home</button></Link>
            </div>
        </div>
    );
};

export default Forbidden;
