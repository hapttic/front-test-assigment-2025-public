import React from "react";
import "./Loader.css";
import { useLoaderProgress } from "../../hooks/useLoaderProgress";

interface LoaderProps {
    loading: boolean;
    onFinish?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ loading, onFinish }) => {
    const progress = useLoaderProgress(loading, onFinish);

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
