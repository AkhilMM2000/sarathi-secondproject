import React from "react";
import ReactPaginate from "react-paginate";


interface PaginationProps {
  pageCount: number;
  onPageChange: (selected: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
  return (
    <ReactPaginate
      previousLabel={"←"}
      nextLabel={"→"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={(event) => onPageChange(event.selected)}
      containerClassName={"pagination"}
      activeClassName={"active"}
    />
  );
};

export default Pagination;
