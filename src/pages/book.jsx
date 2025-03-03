import { useCallback, useEffect, useState } from "react";
import { fetchAllBookAPI } from "../services/api.service";
import BookTable from "../components/book/book.table";
import CreateBookModal from "../components/book/create.book.form";

const BookPage = () => {
  const [dataBooks, setDataBooks] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loadingTable, setLoadingTable] = useState(false);

  const loadBook = useCallback(async () => {
    setLoadingTable(true);
    const res = await fetchAllBookAPI(current, pageSize);
    if (res.data) {
      setDataBooks(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoadingTable(false);
  }, [current, pageSize]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  return (
    <div style={{ padding: "20px" }}>
      <CreateBookModal loadBook={loadBook} />
      <BookTable
        dataBooks={dataBooks}
        current={current}
        setCurrent={setCurrent}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        loadBook={loadBook}
        loadingTable={loadingTable}
      />
    </div>
  );
};

export default BookPage;
