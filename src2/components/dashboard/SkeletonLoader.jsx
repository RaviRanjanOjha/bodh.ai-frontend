import HistorySkeletonLoader from "./HistorySkeletonLoader";
import React from 'react';

const SkeletonLoader = ({ isNewChat }) => {
    const randomWidth = () => {
        return Math.floor(Math.random() * (100 - 90 + 1) + 90) + "%";
    };
    const randomLines = () => {
        return Math.floor(Math.random() * (6 - 2) + 2);
    };

    if (isNewChat) {
        return (
            <div className="animate-pulse flex">
                <div className="w-full">
                    {[...Array(randomLines())].map((_, i) => (
                        <div
                            key={i}
                            className="h-5 rounded animate-shimmer my-1.5"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #E0E0E0 0%, #EBEBEB 25%, #F1F1F1 65%, #E0E0E0 100%)',
                                backgroundSize: '200% 100%',
                                backgroundRepeat: 'no-repeat',
                                animation: 'shimmer 1.5s infinite linear',
                                width: randomWidth()
                            }}
                        ></div>
                    ))}
                </div>
            </div>);
    }
    else {

        return (
            <div className="">
                {[...Array(3)].map((_, i) => <HistorySkeletonLoader key={i} />)}
            </div>
        )
    }
};

export default React.memo(SkeletonLoader);
