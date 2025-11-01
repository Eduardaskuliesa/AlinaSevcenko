import { useEffect, useRef, useState } from "react";

const useStickyAdminActions = () => {
  const [isSticky, setIsSticky] = useState(false);
  const actionButtonsRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (actionButtonsRef.current && placeholderRef.current) {
        const containerRect = placeholderRef.current.getBoundingClientRect();
        if (containerRect.top <= 80) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return { isSticky, actionButtonsRef, placeholderRef };
};

export default useStickyAdminActions;
