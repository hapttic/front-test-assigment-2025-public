import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: Props) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (isMobile: boolean = false) => {
    const pages: (number | string)[] = [];
    const maxVisible = isMobile ? 3 : 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        if (currentPage === 1) {
          pages.push(1);
          if (totalPages > 2) pages.push(2);
          if (totalPages > 3) {
            pages.push("ellipsis");
            pages.push(totalPages);
          }
        } else if (currentPage === totalPages) {
          if (totalPages > 3) {
            pages.push(1);
            pages.push("ellipsis");
          }
          if (totalPages > 1) pages.push(totalPages - 1);
          pages.push(totalPages);
        } else {
          if (currentPage > 2) {
            pages.push(1);
            pages.push("ellipsis");
          }
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
          if (currentPage < totalPages - 1) {
            pages.push("ellipsis");
            pages.push(totalPages);
          }
        }
      } else {
        pages.push(1);

        if (currentPage <= 3) {
          for (let i = 2; i <= 4; i++) {
            pages.push(i);
          }
          pages.push("ellipsis");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push("ellipsis");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push("ellipsis");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("ellipsis");
          pages.push(totalPages);
        }
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers(false);
  const mobilePageNumbers = getPageNumbers(true);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex items-center text-xs md:text-sm text-gray-700">
        <span className="hidden sm:inline">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </span>
        <span className="sm:hidden">
          <span className="font-medium">{startItem}</span>-
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span>
        </span>
      </div>

      <div className="flex items-center justify-center md:justify-end gap-1 md:gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md",
            "hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-gray-700"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors",
                  {
                    "bg-gray-100 text-gray-700 hover:bg-gray-200": !isActive,
                    "bg-gray-900! text-white hover:bg-gray-800!": isActive,
                  }
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <div className="flex md:hidden items-center gap-1">
          {mobilePageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-mobile-${index}`}
                  className="px-1.5 py-1 text-xs text-gray-700"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-md transition-colors min-w-[28px]",
                  {
                    "bg-gray-100 text-gray-700 hover:bg-gray-200": !isActive,
                    "bg-gray-900! text-white hover:bg-gray-800!": isActive,
                  }
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md",
            "hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};
