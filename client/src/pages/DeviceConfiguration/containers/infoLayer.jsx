    
 import { customerInfoMeta, deviceInfoMeta, motorInfoMeta } from '../../../lib/constants/metadata';
import useDevices from '../../../lib/hooks/device';
import CardTable from '../components/cardTable';

export default function InfoLayer() {
    const { device, loading } = useDevices();
    return (
        <section className="mb-2 d-flex flex-wrap gap-2 ">
            <CardTable

                key={"title-device-info"}
                title="Device Information"
                detailPairs={deviceInfoMeta}
                data={device}
                loading={loading}
            />
            <CardTable
                key={"title-motor-info"}
                title="Motor Information"
                detailPairs={motorInfoMeta}
                data={device}
                loading={loading}
            />
            <CardTable
                key={"title-customer-info"}
                title="Customer Information"
                detailPairs={customerInfoMeta}
                data={device}
                loading={loading}
            />
        </section>
    );

}