import { Card, Row, Col } from "react-bootstrap";
import LineChart from "../DeviceDashboard/containers/lineChart";

export default function Dashboard() {
    // Example mock data, replace with real data as needed
    const stats = {
        totalDevices: 1200,
        activeDevices: 950,
        inactiveDevices: 200,
        faultyDevices: 50,
    };
    const cardData = [
        {
            title: "Active Devices",
            value: stats.activeDevices,
         },
        {
            title: "Inactive Devices",
            value: stats.inactiveDevices,
         },
        {
            title: "Faulty Devices",
            value: stats.faultyDevices,
         },
        {
            title: "Total Devices",
            value: stats.totalDevices,
        },
    ];
    return (
        <section className="container py-4">
            <Row className="g-3">
                {cardData.map((card, idx) => (
                    <Col key={idx} xs={12} sm={6} md={3}>
                        <Card
                             className="shadow-sm h-100 border-0"
                        >
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-4">
                                <Card.Title className="fs-6 fw-semibold text-secondary mb-1" style={{ letterSpacing: 1 }}>{card.title}</Card.Title>
                                <Card.Text className="fs-2 fw-bold text-dark mb-0">{card.value}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                <LineChart className="flex-fill w-100" />
            </Row>
        </section>
    );
}