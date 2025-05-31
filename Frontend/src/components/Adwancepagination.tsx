import { useState } from 'react';
import { Pagination as MuiPagination } from '@mui/material';
import { motion } from 'framer-motion';

interface EnhancedPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  color?: 'primary' | 'secondary' | 'standard';
  size?: 'small' | 'medium' | 'large';
}

const EnhancedPagination: React.FC<EnhancedPaginationProps> = ({
  count,
  page,
  onChange,
  color = 'primary',
  size = 'medium'
}) => {
  const [clickedPage, setClickedPage] = useState<number | null>(null);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setClickedPage(value);
    onChange(event, value);
    
    // Reset the clicked page after animation completes
    setTimeout(() => {
      setClickedPage(null);
    }, 300);
  };
  
  return (
    <div className="pagination-container flex flex-col items-center">
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow">
          <MuiPagination
            count={count}
            page={page}
            onChange={handlePageChange}
            color={color}
            size={size}
            classes={{
              root: "pagination-root",
              ul: "pagination-ul flex items-center"
            }}
            sx={{
              '& .MuiPaginationItem-root': {
                margin: '0 2px',
                borderRadius: '50%',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  transform: 'scale(1.1)',
                }
              },
              '& .Mui-selected': {
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  backgroundColor: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                }
              }
            }}
          />
        </div>
        
        {/* Ripple effect when clicking */}
        {clickedPage && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.div
              initial={{ opacity: 0.7, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.4 }}
              transition={{ duration: 0.4 }}
              className="absolute top-1/2 left-0 w-full h-2 bg-blue-300 rounded-full transform -translate-y-1/2 filter blur-sm"
            />
          </div>
        )}
      </div>
      
      {/* Page indicator */}
      <div className="mt-4 text-gray-600 text-sm font-medium bg-blue-50 px-4 py-1 rounded-full shadow-sm">
        Page {page} of {count}
      </div>
    </div>
  );
};

export default EnhancedPagination;