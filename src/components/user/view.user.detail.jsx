import { Drawer } from "antd";

const ViewUserDetail = (props) => {
  const { dataDetail, setDataDetail, isDetailOpen, setIsDetailOpen } = props;
  return (
    <Drawer
      width={"40vw"}
      title="Thông tin chi tiết"
      onClose={() => {
        setDataDetail(null);
        setIsDetailOpen(false);
      }}
      open={isDetailOpen}
    >
      {dataDetail ? (
        <>
          <p>
            <strong>Id:</strong> {dataDetail._id}
          </p>
          <br />
          <p>
            <strong>Họ và tên:</strong> {dataDetail.fullName}
          </p>
          <br />
          <p>
            <strong>Vai trò:</strong> {dataDetail.role}
          </p>
          <br />
          <p>
            <strong>Email:</strong> {dataDetail.email}
          </p>
          <br />
          <p>
            <strong>Số điện thoại:</strong> {dataDetail.phone}
          </p>
          <br />
          <p>
            <strong>Ảnh đại diện:</strong>
          </p>
          <div
            style={{
              marginTop: "10px",
              height: "200px",
              width: "200px",
              border: "1px solid #ccc",
            }}
          >
            <img
              style={{ height: "100%", width: "100%", objectFit: "contain" }}
              src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                dataDetail.avatar
              }`}
            />
          </div>
        </>
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </Drawer>
  );
};
export default ViewUserDetail;
