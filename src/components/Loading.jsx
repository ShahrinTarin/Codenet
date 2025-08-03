import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
    );
};

export default Loading;