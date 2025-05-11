import React from 'react';
import { FaQuestion,FaCog,FaDoorClosed } from "react-icons/fa";
// import { useNavigate } from 'react-router';
import './froatButton.css'

const FroatButton: React.FC = () => {
    const iconsize="100%";
    return (
        <div className="button-container">
            <button className="circle-button"><FaQuestion style={{fontSize:iconsize}}/></button>
            <button className="circle-button"><FaCog style={{fontSize:iconsize}}/></button>
            <button className="circle-button"><FaDoorClosed style={{fontSize:iconsize}}/></button>
        </div>
    )
};

export default FroatButton;