import React from 'react';
import { Pagination } from 'react-bootstrap';

export default function LocalPagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    return (
        <Pagination className="justify-content-center my-2">
            <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
            {pageNumbers.map((num) => (
                <Pagination.Item
                    key={num}
                    active={num === currentPage}
                    onClick={() => onPageChange(num)}
                >
                    {num}
                </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
    );
}
