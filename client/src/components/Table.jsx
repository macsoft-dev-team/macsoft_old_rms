import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import './Table.css';
import { Col, Spinner } from 'react-bootstrap';


const ReusableTable = ({ columns, data, headerColor, headerTextColor, size, onRowClick, onEdit, onDelete, onView, loading, SNo, currentPage, pageSize }) => {
  // Helper to get class for alignment
  const getAlignClass = (align) => {
    if (align === 'right' || align === 'end') return 'text-end';
    if (align === 'center') return 'text-center';
    return 'text-start';
  };

  // Helper to get class for text wrapping
  const getWrapClass = (textWrap, truncate) => {
    if (truncate) return 'text-truncate';
    if (textWrap === 'nowrap') return 'text-nowrap';
    if (textWrap === 'wrap') return 'text-wrap';
    return '';
  };

  const showActions = onEdit || onDelete || onView;
  return (
    <div className="reusable-table-wrapper">
      <Table size={size} bordered hover responsive>
        <thead>
          <tr>
            {SNo && (
              <th
              width={50}
                style={{ backgroundColor: headerColor, color: headerTextColor, minWidth: 50 }}
                className="text-center text-uppercase fw-medium"
              >
                SNo
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...(col.width ? { width: col.width, minWidth: 50 } : { minWidth: 50 }),
                  backgroundColor: headerColor,
                  color: headerTextColor
                }}
                className={getAlignClass(col.align) + ' ' + getWrapClass(col.textWrap, col.truncate) + ' text-uppercase fw-medium'}
              >
                {col.label}
              </th>
            ))}
            {showActions && <th width={100} style={{ backgroundColor: headerColor, color: headerTextColor }} className="text-center text-uppercase fw-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} onClick={() => onRowClick && onRowClick(row)} style={onRowClick ? { cursor: 'pointer' } : {}}>
              {SNo && (
                <td className="text-center">{((currentPage - 1) * pageSize) + i + 1}</td>
              )}
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={col.width ? { width: col.width, minWidth: 50 } : { minWidth: 50 }}
                  className={getAlignClass(col.align) + ' ' + getWrapClass(col.textWrap, col.truncate)}
                >
                  {row[col.key]}
                </td>
              ))}
              {showActions && (
                <td className="text-center">
                  <ButtonGroup size="sm">
                    {onView && <Button size='sm' variant="secondary" onClick={e => { e.stopPropagation(); onView(row); }}><FaEye /></Button>}
                    {onEdit && <Button size='sm' variant="success" onClick={e => { e.stopPropagation(); onEdit(row); }}><FaEdit /></Button>}
                    {onDelete && <Button size='sm' variant="danger" onClick={e => { e.stopPropagation(); onDelete(row); }}><FaTrash /></Button>}
                  </ButtonGroup>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {data.length === 0 && !loading && (
          <tbody>
            <tr>
              <td colSpan={columns.length + (showActions ? 1 : 0) + (SNo ? 1 : 0)} className="text-center text-muted">
                No data available
              </td>
            </tr>
          </tbody>
        )} 
        {data.length === 0 && loading && (
          <tbody>
            <tr>
              <td colSpan={columns.length + (showActions ? 1 : 0) + (SNo ? 1 : 0)} className="text-center">
                <Col className="d-flex h-100 align-items-center justify-content-center">Loading <Spinner size="sm" className="mx-2" animation="border" variant="primary" /></Col>
              </td>
            </tr>
          </tbody>
        )}
      </Table>
    </div>
  );
};

export default ReusableTable;
