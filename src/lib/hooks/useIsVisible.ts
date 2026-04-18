// hooks/useIsVisible.ts
import { useEffect, useState, RefObject } from "react";

export function useIsVisible(ref: RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}