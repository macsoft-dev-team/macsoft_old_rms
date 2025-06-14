 import { Pagination as RPagination } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
  };

  const renderPaginationItems = () => {
    let items = [];

    if (totalPages <= 5) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <RPagination.Item
            key={number}
            id={`pagination-item-${number}`}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </RPagination.Item>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let number = 1; number <= 5; number++) {
          items.push(
            <RPagination.Item
              key={number}
              id={`pagination-item-${number}`}
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </RPagination.Item>
          );
        }
      } else if (currentPage >= totalPages - 2) {
        for (let number = totalPages - 4; number <= totalPages; number++) {
          items.push(
            <RPagination.Item
              key={number}
              id={`pagination-item-${number}`}
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </RPagination.Item>
          );
        }
      } else {
        for (
          let number = currentPage - 2;
          number <= currentPage + 2;
          number++
        ) {
          items.push(
            <RPagination.Item
              key={number}
              id={`pagination-item-${number}`}
              active={number === currentPage}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </RPagination.Item>
          );
        }
      }
    }
    return items;
  };

  return (
    <RPagination className="select-none justify-content-center p-1 m-0">
      <RPagination.First
        id="pagination-first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
      <RPagination.Prev
        id="pagination-prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {renderPaginationItems()}
      <RPagination.Next
        id="pagination-next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <RPagination.Last
        id="pagination-last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </RPagination>
  );
};

export default Pagination;
