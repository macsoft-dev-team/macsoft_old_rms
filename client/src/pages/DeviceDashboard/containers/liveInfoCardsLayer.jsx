import React from 'react';
import { Card } from 'react-bootstrap';
import { deviceConfigData } from '../../../lib/constants/metadata';
import LineChart from './lineChart';
    

function LiveInfoCard() {
    return (
        <section className="d-md-flex d-grid flex-wrap gap-2 align-content-stretch">
            {Object.entries(deviceConfigData).map(([groupName, stats]) => (
                <Card className="shadow-sm flex-fill" key={groupName}>
                    {/*  <Card.Header>
        <Row>
            <Col xs={12} className="text-center fw-medium text-uppercase">
                {groupName}
            </Col>
        </Row>
    </Card.Header> */}
                    <Card.Body className="p-2 py-1">
                        <table className="table table-responsive table-borderless fw-medium">
                            <tbody>
                                {stats.map((stat, idx) => (
                                    <tr key={idx}>
                                        <td className="fw-light text-muted">
                                            {stat.label}
                                        </td>
                                        <td className={`text-end ${stat.className}`}>
                                            {stat.value ? stat.value : '-'}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </Card.Body>
                </Card>
            ))}
            <div className="flex-fill w-100">
            <LineChart />
            </div>
        </section>
    );
}

export default React.memo(LiveInfoCard);



