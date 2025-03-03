import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Table } from "antd";
import { useState } from "react";
import ViewBookDetail from "./view.book.detail";
import UpdateBookModal from "./update.book.modal";
import { deleteBookAPI } from "../../services/api.service";

const BookTable = (props) => {
  const [dataDetail, setDataDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    dataBooks,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    total,
    loadBook,
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

  const handleDeleteBook = async (id) => {
    setLoading(true);
    const res = await deleteBookAPI(id);
    if (res.data) {
      notification.success({
        message: "Xóa sách",
        description: "Xóa sách thành công",
      });
      await loadBook();
    } else {
      notification.error({
        message: "Xóa sách không thành công",
        description: JSON.stringify(res.message),
      });
    }
    setLoading(false);
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
      title: "Tiêu đề",
      dataIndex: "mainText",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      render: (text) => {
        if (text)
          return new Intl.NumberFormat(`vi-VN`, {
            style: `currency`,
            currency: `VND`,
          }).format(text);
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
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
            title="Xóa sách"
            description="Bạn chắc chắn xóa quyển sách này chứ?"
            onConfirm={() => handleDeleteBook(record._id)}
            okText="Có"
            cancelText="Không"
            placement="left"
            okButtonProps={{ loading: loading }}
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
        dataSource={dataBooks}
        columns={columns}
        rowKey={"_id"}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} trên {total} dòng
              </div>
            );
          },
        }}
        onChange={onChange}
        loading={loadingTable}
      />
      <ViewBookDetail
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
      />
      <UpdateBookModal
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        loadBook={loadBook}
      />
    </>
  );
};

export default BookTable;
