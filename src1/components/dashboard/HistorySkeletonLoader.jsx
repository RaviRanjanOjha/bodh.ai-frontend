import React from 'react'

function HistorySkeletonLoader({key}) {
    const randomWidth = () => {
        return Math.floor(Math.random() * (100 - 90 + 1) + 90) + "%";
    };
    const randomLines = () => {
        return Math.floor(Math.random() * (5 - 3) + 3);
    };

    return (
        < div className="space-y-4 animate-pulse flex flex-col h-auto mb-8" key={key} >
            <div className="flex w-full mb-3 px-3 items-center">
                <div
                    className="w-7 h-7 rounded-full animate-shimmer"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #E0E0E0 0%, #EBEBEB 25%, #F1F1F1 65%, #E0E0E0 100%)',
                        backgroundSize: '200% 100%',
                        backgroundRepeat: 'no-repeat',
                        animation: 'shimmer 1.5s infinite linear'
                    }}
                ></div>
                <div className="w-full pl-3">
                    {[...Array(1)].map((_, i) => (
                        <div
                            key={i}
                            className="h-5 rounded animate-shimmer"
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
            </div>
            <div className="flex w-full px-3">
                <div
                    className="w-7 h-7 rounded-full animate-shimmer"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #E0E0E0 0%, #EBEBEB 25%, #F1F1F1 65%, #E0E0E0 100%)',
                        backgroundSize: '200% 100%',
                        backgroundRepeat: 'no-repeat',
                        animation: 'shimmer 1.5s infinite linear'
                    }}
                ></div>
                <div className="w-full pl-3">
                    {[...Array(randomLines())].map((_, i) => (
                        <div
                            key={i}
                            className="h-4 rounded animate-shimmer mb-1.5"
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
            </div>
        </div >
    )
}

export default HistorySkeletonLoader