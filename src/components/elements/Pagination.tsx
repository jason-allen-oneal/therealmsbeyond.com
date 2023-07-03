type Thing = Article | Gallery;
type Things = Thing[];
type Props = {
  items: Things;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ items, pageSize, currentPage, onPageChange }: Props) => {
  const pagesCount = Math.ceil(items.length / pageSize);

  if (pagesCount === 1) {
    return (
      <div className="btn-group">
        <button className="btn btn-sm btn-disabled">1</button>
      </div>
    );
  }

  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  return (
    <div className="btn-group">
      {pages.map((page) => (
        <button
          key={page}
          className={`btn btn-sm ${page === currentPage ? "btn-active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
