import { useCallback, useEffect, useState } from "react";
import { fetchAllUserAPI } from "../services/api.service";
import UserTable from "../components/user/user.table";

const UserPage = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loadingTable, setLoadingTable] = useState(false);

  const loadUser = useCallback(async () => {
    setLoadingTable(true);
    const res = await fetchAllUserAPI(current, pageSize);
    if (res.data) {
      setDataUsers(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoadingTable(false);
  }, [current, pageSize]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div style={{ padding: "20px" }}>
      <UserTable
        dataUsers={dataUsers}
        current={current}
        setCurrent={setCurrent}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        loadUser={loadUser}
        loadingTable={loadingTable}
      />
    </div>
  );
};

export default UserPage;
