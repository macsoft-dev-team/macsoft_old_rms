import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./components/header";
import useDevices from "../../lib/hooks/device";
import InfoLayer from "./containers/infoLayer";
import LiveInfoCardsLayer from "./containers/liveInfoCardsLayer";
import HistoryLog from "./containers/historyLayer";
import { Tabs, Tab, Button, Form } from "react-bootstrap";
import CardTable from "./components/cardTable";
import { customerInfoMeta, deviceInfoMeta } from "../../lib/constants/metadata";
import { EditBtn } from "../../components/common-components";

export default function DeviceDashboard() {
    const { deviceId } = useParams();
    const { device, fetchDeviceById } = useDevices();

    useEffect(() => {
        if (deviceId) {
            fetchDeviceById(deviceId);
        }
    }, [deviceId]);
    return (
        <div className="container-fluid px-1 px-md-3">
            <Tabs
                defaultActiveKey="live"
                id="device-dashboard-tabs"
                className="mb-1 flex-nowrap overflow-auto"
                mountOnEnter
                unmountOnExit
                style={{ whiteSpace: 'nowrap' }}
            >
                <Tab eventKey="mqtt" title={<span style={{ fontSize: 14 }}>MQTT Configuration</span>}>
                         <MQTTConfiguration />
                 </Tab>
                <Tab eventKey="customer" title={<span style={{ fontSize: 14 }}>Customer Details</span>}>
                    <CustomerDetails />
                </Tab>
                <Tab eventKey="live" title={<span style={{ fontSize: 14 }}>Device Live Data</span>}>
                    <div className="p-2">
                        <LiveInfoCardsLayer device={device} />
                    </div>
                </Tab>
                <Tab eventKey="history" title={<span style={{ fontSize: 14 }}>Device History</span>}>
                    <div className="p-2">
                        <HistoryLog deviceId={deviceId} />
                    </div>
                </Tab>
                <Tab eventKey="vfd" title={<span style={{ fontSize: 14 }}>VFD Configuration</span>}>
                    <div className="p-2 text-secondary">VFD Configuration</div>
                </Tab>
                <Tab eventKey="console" title={<span style={{ fontSize: 14 }}>Command Console</span>}>
                    <CommandConsole />
                </Tab>
            </Tabs>
        </div>
    );
}





function MQTTConfiguration() {
    const [isEditing, setIsEditing] = useState(false);
    const { device, loading } =useDevices();
    return (
        <div className="text-secondary">
            <CardTable
                key={"title-device-info"}
                 detailPairs={deviceInfoMeta}
                data={device}
                loading={loading}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onSubmit={(formData) => {
                    // Handle form submission
                    console.log("Form submitted with data:", formData);
                    
                }}
            />
            
            
        </div>
    );
}

function CustomerDetails() {
    const { device, loading } = useDevices();
    return (
        <div className="text-secondary">
            <CardTable
                key={"title-customer-info"}
                detailPairs={customerInfoMeta}
                data={device}
                loading={loading}
            />
        </div>
    );
}

function CommandConsole() {
    return (
     <Form className="p-2 d-flex flex-column flex-md-row gap-2">
            <Form.Group>
                <Form.Select>
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="flex-fill">
                <Form.Control
                    type="text"
                    placeholder="Enter command"
                    className="form-control"
                 />
            </Form.Group>
            <Form.Group className="flex-fill">
                <Form.Control
                    type="text"
                    placeholder="Enter command"
                    className="form-control"
                />
            </Form.Group>
     
            <Button variant="primary" type="submit">
                Send
            </Button>
        </Form>
    );
}