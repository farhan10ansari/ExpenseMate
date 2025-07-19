import { useCallback, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

// Custom hook to handle scroll to top functionality
export const useScrollToTop = (scrollElementRef: React.RefObject<any>) => {
    // FAB visibility state
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    // track last scroll offset to detect direction
    const lastOffsetY = useRef(0);
    // handle scroll event to show/hide FAB
    const THRESHOLD = 100;
    const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        // Only show FAB when:
        //  - currentOffset > THRESHOLD
        //  - user is scrolling up (delta < 0)
        const currentY = e.nativeEvent.contentOffset.y;
        const delta = currentY - lastOffsetY.current;

        const isPastThreshold = currentY > THRESHOLD;
        const isScrollingUp = delta < 0;

        setShowScrollToTop(isPastThreshold && isScrollingUp);
        lastOffsetY.current = currentY;
    }, []);

    // scroll back to very top
    const scrollToTop = useCallback(() => {
        scrollElementRef.current?.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0,
            animated: true,
        });
    }, []);

    return {
        showScrollToTop,
        handleScroll,
        scrollToTop,
    };
}