import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./components/header";
import useDevices from "../../lib/hooks/device";
import InfoLayer from "./containers/infoLayer";
import LiveInfoCardsLayer from "./containers/liveInfoCardsLayer";
import HistoryLog from "./containers/historyLayer";
 

export default function DeviceConfiguration() {
    const { deviceId } = useParams();
    const { device, fetchDeviceById } = useDevices();

    useEffect(() => {
        if (deviceId) {
            fetchDeviceById(deviceId);
        }
    }, [deviceId]);

    console.log("Device Configuration Data:", device);

    return (
        <>

            {/* Header Section */}
            <Header deviceId={deviceId} />
            {/* Device and customer information */}
            <InfoLayer />
            {/* Live Info Cards Layer */}
            <LiveInfoCardsLayer />
            {/* History Log */}
            <HistoryLog />

        </>
    );
}



