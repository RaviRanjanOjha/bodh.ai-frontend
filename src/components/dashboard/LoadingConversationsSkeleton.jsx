
const LoadingConversationsSkeleton = () => {
    
    return (<div className="space-y-4 pr-4 animate-pulse w-full">
        {[...Array(4)].map((_, i) => (
            <div
                key={i}
                className="h-4 rounded animate-shimmer mb-1"
                style={{
                    backgroundImage: 'linear-gradient(to right, #b2a6ba 0%, #c1b8c8 25%, #d1cad6 65%, #c9bbd2 100%)',
                    backgroundSize: '200% 100%',
                    backgroundRepeat: 'no-repeat',
                    animation: 'shimmer 1.5s infinite linear',
                    width: "95%"
                }}
            ></div>
        ))}
    </div>);
};


export default LoadingConversationsSkeleton;