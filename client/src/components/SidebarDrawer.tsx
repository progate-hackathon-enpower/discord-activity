import React, { useState, useRef, useEffect } from 'react';
import { FaMusic, FaHourglass, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import './SidebarDrawer.css';

const SidebarDrawer: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setDrawerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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