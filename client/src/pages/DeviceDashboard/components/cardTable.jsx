import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Spinner, Card, Form, ButtonGroup, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function CardTable(props) {
    const { title: groupName, detailPairs: stats, data, loading, isEditing, onSubmit, setIsEditing, validationSchema } = props;
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: data ,resolver:yupResolver(validationSchema)});
    

    const renderCell = (stat) => {
        if (isEditing) {
            return (
                <Form.Group>
                    <Form.Control
                        type="text"
                        {...register(stat.key)}
                        disabled={stat.disabled}
                        defaultValue={data?.[stat.key] || ''}
                        className="text-start px-2 w-lg-auto"
                        style={{ height: "30px" }}
                    />
                    {errors[stat.key] && <span className="text-danger">{errors[stat.key].message}</span>}
                </Form.Group>
            );
        }
        return (
            <span>
                {data?.[stat.key]
                    ? (typeof data[stat.key] === "object"
                        ? JSON.stringify(data[stat.key])
                        : data[stat.key])
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
                         <figure>
                            {stats.map((stat, idx) => (
                                <figcaption key={idx} className='d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between py-lg-2'>
                                    <div className="fw-light text-muted flex-fill py-1 py-lg-0">
                                        {stat.label}
                                    </div>
                                    <div className={`text-wrap flex-fill ${stat.className || ''}`}  style={{ maxWidth: '550px',minWidth:'250px' }}>
                                        {renderCell(stat)}
                                    </div>
                                </figcaption>
                            ))}
                        </figure>
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