import { MotionDiv, DeviceCard, DeviceSkeleton } from '.';
 import { useEffect, useState } from 'react';


const DevicesGrid = ({ devices, loading }) => {
    const [fakeLoading, setFakeLoading] = useState(true);

    useEffect(() => {
        setFakeLoading(true);
        const timer = setTimeout(() => {
            setFakeLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [devices]);

    const showLoading = loading || fakeLoading;

    return (
        <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {showLoading
                ? Array.from({ length: 10 }).map((_, idx) => (
                    <DeviceSkeleton key={idx} />
                ))
                : devices.map((device, index) => (
                    <DeviceCard
                        key={device.id}
                        device={device}
                        delay={index * 0.1}
                        darkMode={true}
                    />
                ))}
        </MotionDiv>
    );
};

export default DevicesGrid;
