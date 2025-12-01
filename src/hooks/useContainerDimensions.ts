import { useState, useRef, useLayoutEffect } from "react";

const useContainerDimensions = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width, 400),
          height: Math.max(height, 300),
        });
      }
    };

    updateDimensions();

    const timeoutId = setTimeout(updateDimensions, 100);

    window.addEventListener("resize", updateDimensions);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return { ref, dimensions };
};

export default useContainerDimensions;
