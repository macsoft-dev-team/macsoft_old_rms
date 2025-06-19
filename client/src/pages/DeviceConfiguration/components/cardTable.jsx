import React from 'react';
import { Spinner, Table } from 'react-bootstrap';

function CardTable(props) {
    const { title, detailPairs, data, loading } = props;
    return (
        <section className="flex-fill card-table" key={title}>
                  <h6 className="text-uppercase">{title}</h6>
                <Table responsive bordered className="table-sm shadow-sm align-middle text-nowrap">
                    <tbody>
                        {(detailPairs.length > 4 // more than 4 items = 4-column layout
                            ? detailPairs.reduce((rows, item, index) => {
                                if (index % 2 === 0) rows.push([item]);
                                else rows[rows.length - 1].push(item);
                                return rows;
                            }, [])
                            : detailPairs.map((item) => [item]) // 2-column layout
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
                                        <td className="text-end px-2" style={{ height: "30px" }}>{data?.[detail.key] ? data[detail.key] : loading ? <Spinner animation="border" size="sm" /> : '-'} {detail.unit ? detail.unit : ''}</td>
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
        </section>
    );
}

 export default React.memo(CardTable);