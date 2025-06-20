import React from 'react';
import { Spinner, Card, Form, ButtonGroup, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function CardTable(props) {
    const { title: groupName, detailPairs: stats, data, loading, isEditing, onSubmit, setIsEditing } = props;
    const { register, handleSubmit } = useForm({ defaultValues: data });

    const renderCell = (stat) => {
        if (isEditing) {
            return (
                <Form.Control
                    size="sm"
                    type="text"
                    {...register(stat.key)}
                    defaultValue={data?.[stat.key] || ''}
                    className="text-end px-2"
                    style={{ height: "30px" }}
                />
            );
        }
        return (
            <span>
                {data?.[stat.key]
                    ? data[stat.key]
                    : loading
                        ? <Spinner animation="border" size="sm" />
                        : '-'} {stat.unit ? stat.unit : ''}
            </span>
        );
    };

    return (
        <Card className="shadow-sm flex-fill my-1" key={groupName}>
            <Card.Body className="p-2 py-1">
                {setIsEditing && !isEditing && (
                    <header className="d-flex align-items-center justify-content-end">
                        <Button
                            className="text-uppercase"
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            Edit
                        </Button>
                    </header>
                )}  
                <Form onSubmit={isEditing ? handleSubmit(onSubmit) : undefined}>
                    <table className="table table-responsive table-borderless fw-medium">
                        <tbody>
                            {stats.map((stat, idx) => (
                                <tr key={idx}>
                                    <td className="fw-light text-muted">
                                        {stat.label}
                                    </td>
                                    <td className={`text-end ${stat.className || ''}`}>
                                        {renderCell(stat)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isEditing && (
                        <ButtonGroup className="text-end">
                            <Form.Control
                                type="button"
                                value="Cancel"
                                className="btn btn-secondary btn-sm mt-2 w-auto"
                                onClick={() => setIsEditing(false)}
                            />
                            <Form.Control type="submit" value="Save" className="btn btn-primary btn-sm mt-2 w-auto" />
                        </ButtonGroup>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
}

export default React.memo(CardTable);