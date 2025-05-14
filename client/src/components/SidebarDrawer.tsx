import React, { useState, useRef } from 'react';
import { FaMusic, FaHourglass, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import './SidebarDrawer.css';
import { useClickOutside } from '../hooks/useClickOutside';

const SidebarDrawer: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useClickOutside(sidebarRef, () => {
        if (drawerOpen) {
            setDrawerOpen(false);
        }
    });

    return (
        <div ref={sidebarRef} className={`sidebar${drawerOpen ? ' sidebar--open' : ''}`}> 
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

export default SidebarDrawer; 