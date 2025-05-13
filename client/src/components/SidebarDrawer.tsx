import React, { useState } from 'react';
import { FaMusic, FaHourglass, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import '../Home.css';

const sideBarDrawer: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <div className={`sidebar${drawerOpen ? ' sidebar--open' : ''}`}> 
            <button className="sidebar__toggle" onClick={() => setDrawerOpen(!drawerOpen)}>
                {drawerOpen ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
            {drawerOpen && (
                <div className="sidebar__icons">
                    <FaMusic className="sidebar__icon" />
                    <FaHourglass className="sidebar__icon" />
                </div>
            )}
        </div>
    );
};

export default sideBarDrawer; 