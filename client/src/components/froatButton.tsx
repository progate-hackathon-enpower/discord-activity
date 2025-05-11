import React from 'react';
import { FaQuestion,FaCog,FaDoorClosed } from "react-icons/fa";
// import { useNavigate } from 'react-router';
import './froatButton.css'

const FroatButton: React.FC = () => {
    return (
        <div className="button-container">
            <button className="circle-button"><FaQuestion/></button>
            <button className="circle-button"><FaCog/></button>
            <button className="circle-button"><FaDoorClosed/></button>
        </div>
    )
};

export default FroatButton;