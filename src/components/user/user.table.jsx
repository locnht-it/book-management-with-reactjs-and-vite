import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Table } from "antd";
import { useState } from "react";
import ViewUserDetail from "./view.user.detail";
import UpdateUserModal from "./update.user.modal";
import { deleteUserAPI } from "../../services/api.service";

const UserTable = (props) => {
  const [dataDetail, setDataDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    dataUsers,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    total,
    loadUser,
    loadingTable,
  } = props;

  const onChange = (pagination) => {
    if (pagination && pagination.current) {
      if (+pagination.current !== +current) {
        setCurrent(+pagination.current);
      }
    }

    if (pagination && pagination.pageSize) {
      if (+pagination.pageSize !== +pageSize) {
        setPageSize(+pagination.pageSize);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    setDeleteLoading(true);
    const res = await deleteUserAPI(id);
    if (res.data) {
      notification.success({
        message: "Xoá người dùng",
        description: "Xóa người dùng thành công",
      });
      await loadUser();
    } else {
      notification.error({
        message: "Xoá người dùng không thành công",
        description: JSON.stringify(res.message),
      });
    }
    setDeleteLoading(false);
  };

  const columns = [
    {
      title: "STT",
      render: (_, record, index) => {
        return <>{index + 1 + (current - 1) * pageSize}</>;
      },
    },
    {
      title: "Id",
      dataIndex: "_id",
      render: (_, record) => {
        return (
          <a
            href="#"
            onClick={() => {
              setDataDetail(record);
              setIsDetailOpen(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "20px" }}>
          <EditOutlined
            style={{ cursor: "pointer", color: "orange" }}
            onClick={() => {
              setDataUpdate(record);
              setIsModalUpdateOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn chắc chắn xóa người dùng này chứ?"
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Có"
            cancelText="Không"
            placement="left"
            okButtonProps={{ loading: deleteLoading }}
          >
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataUsers}
        rowKey={"_id"}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} trên {total} rows
              </div>
            );
          },
        }}
        onChange={onChange}
        loading={loadingTable}
      />
      <ViewUserDetail
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
      />
      <UpdateUserModal
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        loadUser={loadUser}
      />
    </>
  );
};

export default UserTable;
