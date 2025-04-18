import React from "react";
import { Pagination, Stack } from "@mui/material";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const CustomPagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
      />
    </Stack>
  );
};

export default CustomPagination;