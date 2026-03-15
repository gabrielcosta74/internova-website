import React, { createContext, useContext, useEffect, useState } from 'react';

// Check synchronously if we are in the browser
const getInitialMobileState = () => {
    if (typeof window !== 'undefined') {
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        return window.innerWidth < 1024 || isTouch; // match iPad/Tablets and touch devices
    }
    return false;
};

const DeviceContext = createContext({ isMobile: getInitialMobileState() });

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(getInitialMobileState());

    useEffect(() => {
        const checkMobile = () => {
            const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            setIsMobile(window.innerWidth < 1024 || isTouch);
        };
        checkMobile(); // Check immediately
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <DeviceContext.Provider value={{ isMobile }}>
            {children}
        </DeviceContext.Provider>
    );
};

export const useDevice = () => useContext(DeviceContext);
