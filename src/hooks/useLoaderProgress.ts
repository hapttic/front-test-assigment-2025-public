import { useState, useEffect } from "react";

export const useLoaderProgress = (loading: boolean, onFinish?: () => void) => {
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

    return progress;
};
