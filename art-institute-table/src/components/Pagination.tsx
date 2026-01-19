import './Pagination.css';

// Basic TypeScript function component
// This component handles pagination buttons
function Pagination({ 
    currentPage, 
    totalPages, 
    setCurrentPage 
}: { 
    currentPage: number;          // Current page number
    totalPages: number;            // Total number of pages
    setCurrentPage: (page: number) => void;  // Function to update page
}) {
    return (
        <div className='pagination'>
            {/* Previous button - disabled on first page */}
            <button 
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {/* Show current page and total pages */}
            <span>{currentPage} of {totalPages}</span>

            {/* Next button - disabled on last page */}
            <button 
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;