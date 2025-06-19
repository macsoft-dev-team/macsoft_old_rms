import React from 'react';
import { FaCog } from 'react-icons/fa';
import  LinkButton  from './linkButton';
function Header({ deviceId }) {
    return (
        <header className="d-md-flex align-items-center justify-content-between mb-2">
            <h6 className="text-uppercase d-flex align-items-center gap-2 text-primary-emphasis">SSP-031939<FaCog /></h6>
            <div className="d-flex gap-2">
                <LinkButton to={`/device/device-configuration/${deviceId}/configuration-request`} text="Configuration Request" variant="outline-primary" />
                <LinkButton to={`/devices`} text="Back to devices" variant="primary" />
            </div>
        </header>
    );
}

//REact memo to prevent unnecessary re-renders
export default React.memo(Header);