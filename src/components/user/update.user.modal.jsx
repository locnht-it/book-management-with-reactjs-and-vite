import { Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { handleUploadFileAPI, updateUserAPI } from "../../services/api.service";

const UpdateUserModal = (props) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    dataUpdate,
    setDataUpdate,
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    loadUser,
  } = props;

  useEffect(() => {
    if (dataUpdate && dataUpdate._id) {
      form.setFieldsValue({
        id: dataUpdate._id,
        fullName: dataUpdate.fullName,
        phone: dataUpdate.phone,
      });
      setPreview(
        `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataUpdate.avatar}`
      );
    }
  }, [dataUpdate]);

  const handleOnChangeFile = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitBtn = async (values) => {
    if (!selectedFile && !preview) {
      notification.error({
        message: "Cập nhật người dùng không thành công",
        description: "Vui lòng upload ảnh đại diện",
      });
      return;
    }

    setLoading(true);

    let newAvatar = "";
    if (!selectedFile && preview) {
      newAvatar = dataUpdate.avatar;
    } else {
      const resUpload = await handleUploadFileAPI(selectedFile, "avatar");
      if (resUpload.data) {
        newAvatar = resUpload.data.fileUploaded;
      } else {
        notification.error({
          message: "Upload ảnh đại diện không thành công",
          description: JSON.stringify(resUpload.message),
        });
        return;
      }
    }

    await updateUser(newAvatar, values);
    setLoading(false);
  };

  const updateUser = async (newAvatar, values) => {
    const { id, fullName, phone } = values;
    const res = await updateUserAPI(id, fullName, phone, newAvatar);
    if (res.data) {
      notification.success({
        message: "Cập nhật người dùng",
        description: "Cập nhật người dùng thành công",
      });
      resetAndCloseModal();
      await loadUser();
    } else {
      notification.error({
        message: "Cập nhật người dùng không thành công",
        description: JSON.stringify(res.message),
      });
    }
  };

  const resetAndCloseModal = () => {
    form.resetFields();
    setIsModalUpdateOpen(false);
    setSelectedFile(null);
    setPreview(null);
    setDataUpdate(null);
  };

  return (
    <Modal
      title="Cập nhật người dùng"
      open={isModalUpdateOpen}
      onOk={() => form.submit()}
      onCancel={() => resetAndCloseModal()}
      maskClosable={false}
      okText={"CẬP NHẬT"}
      cancelText={"Hủy"}
      okButtonProps={{ loading: loading }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmitBtn}>
        <Form.Item style={{ width: "100%" }} label="Id" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item
          style={{ width: "100%" }}
          label="Họ và tên"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ và tên!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{ width: "100%" }}
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Ảnh đại diện</span>
          <label
            htmlFor="btnUpload"
            style={{
              display: "block",
              width: "fit-content",
              marginTop: "15px",
              padding: "5px 10px",
              background: "orange",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Upload
          </label>
          <input
            type="file"
            hidden
            id="btnUpload"
            onChange={(event) => handleOnChangeFile(event)}
            onClick={(event) => {
              event.target.value = null;
            }}
            style={{ display: "none" }}
          />
        </div>
        {preview && (
          <div
            style={{
              marginTop: "10px",
              marginBottom: "15px",
              height: "200px",
              width: "200px",
            }}
          >
            <img
              style={{ height: "100%", width: "100%", objectFit: "contain" }}
              src={preview}
            />
          </div>
        )}
      </Form>
    </Modal>
  );
};
export default UpdateUserModal;
