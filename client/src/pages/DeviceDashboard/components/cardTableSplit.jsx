import React from 'react';
import { Spinner, Table, Form, ButtonGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function CardTableSplit(props) {
    const { title, detailPairs, data, loading, isEditing, onSubmit, setIsEditing } = props;
    const { register, handleSubmit } = useForm({ defaultValues: data });

    const renderCell = (detail) => {
        if (isEditing) {
            return (
                <Form.Control
                    size="sm"
                    type="text"
                    {...register(detail.key)}
                    defaultValue={data?.[detail.key] || ''}
                    className="text-end px-2"
                    style={{ height: "30px" }}
                />
            );
        }
        return (
            <span>
                {data?.[detail.key]
                    ? data[detail.key]
                    : loading
                        ? <Spinner animation="border" size="sm" />
                        : '-'} {detail.unit ? detail.unit : ''}
            </span>
        );
    };

    return (
        <section className="flex-fill card-table" key={title}>
            <h6 className="text-uppercase">{title}</h6>
            <Form onSubmit={isEditing ? handleSubmit(onSubmit) : undefined}>
                <Table responsive bordered className="table-sm shadow-sm align-middle text-nowrap">
                    <tbody>
                        {(detailPairs.length > 4
                            ? detailPairs.reduce((rows, item, index) => {
                                if (index % 2 === 0) rows.push([item]);
                                else rows[rows.length - 1].push(item);
                                return rows;
                            }, [])
                            : detailPairs.map((item) => [item])
                        ).map((pair, rowIndex) => (
                            <tr key={rowIndex}>
                                {pair.map((detail, i) => (
                                    <React.Fragment key={i}>
                                        <th
                                            className="text-primary-emphasis text-uppercase"
                                            style={{ fontSize: "13px" }}
                                        >
                                            {detail.label}
                                        </th>
                                        <td className="text-end px-2" style={{ height: "30px" }}>
                                            {renderCell(detail)}
                                        </td>
                                    </React.Fragment>
                                ))}
                                {pair.length < (detailPairs.length > 4 ? 2 : 1) && (
                                    <>
                                        <th ></th>
                                        <td style={{ height: "30px" }}></td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
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
        </section>
    );
}

export default React.memo(CardTableSplit);
