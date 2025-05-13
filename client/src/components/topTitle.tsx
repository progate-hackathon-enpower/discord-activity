import React from 'react';
import '../Home.css';

type TopTitleProps = {
    title: string;
};

const TopTitle: React.FC<TopTitleProps> = ({ title }) => {
    return (
        <div className="home__header">
            <span className="home__title">{title}</span>
        </div>
    );
};

export default TopTitle; 