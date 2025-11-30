import React, { useEffect, useState } from "react";
import "./Loader.css";

interface LoaderProps {
    loading: boolean;
    onFinish?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ loading, onFinish }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!loading) {
            setProgress(100);
            const timeout = setTimeout(() => {
                onFinish?.();
                setProgress(0);
            }, 300);
            return () => clearTimeout(timeout);
        }
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 95 ? 95 : prev + Math.random() * 5));
        }, 100);
        return () => clearInterval(interval);
    }, [loading, onFinish]);

    if (!loading && progress === 0) return null;

    return (
        <div className="loader-container">
            <h1 className="loader-title">Admin Dashboard</h1>
            <div className="loader-bar-background">
                <div className="loader-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default Loader;
