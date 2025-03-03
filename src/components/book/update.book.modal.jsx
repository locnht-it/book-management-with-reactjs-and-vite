import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { handleUploadFileAPI, updateBookAPI } from "../../services/api.service";

const UpdateBookModal = (props) => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    dataUpdate,
    setDataUpdate,
    isModalUpdateOpen,
    setIsModalUpdateOpen,
    loadBook,
  } = props;

  useEffect(() => {
    if (dataUpdate && dataUpdate._id) {
      form.setFieldsValue({
        id: dataUpdate._id,
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        quantity: dataUpdate.quantity,
        category: dataUpdate.category,
      });
      setPreview(
        `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          dataUpdate.thumbnail
        }`
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
        message: "Cập nhật sách không thành công",
        description: "Vui lòng upload ảnh thumbnail",
      });
      return;
    }

    setLoading(true);

    let newThumbnail = "";
    if (!selectedFile && preview) {
      newThumbnail = dataUpdate.thumbnail;
    } else {
      const resUpload = await handleUploadFileAPI(selectedFile, "book");
      if (resUpload.data) {
        newThumbnail = resUpload.data.fileUploaded;
      } else {
        notification.error({
          message: "Upload ảnh thumbnail không thành công",
          description: JSON.stringify(resUpload.message),
        });
        return;
      }
    }

    await updateBook(newThumbnail, values);
    setLoading(false);
  };

  const updateBook = async (newThumbnail, values) => {
    const { id, mainText, author, price, quantity, category } = values;
    console.log(`>>> Check values: `, id);
    const res = await updateBookAPI(
      id,
      newThumbnail,
      mainText,
      author,
      price,
      quantity,
      category
    );
    if (res.data) {
      notification.success({
        message: "Cập nhật sách",
        description: "Cập nhật sách thành công",
      });
      resetAndCloseModal();
      await loadBook();
    } else {
      notification.error({
        message: "Cập nhật sách không thành công",
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
      title="Cập nhật sách"
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
          label="Tiêu đề"
          name="mainText"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tiêu đề!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{ width: "100%" }}
          label="Tác giả"
          name="author"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên tác giả",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{ width: "100%" }}
          label="Giá tiền"
          name="price"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá tiền",
            },
          ]}
        >
          <InputNumber addonAfter={`đ`} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          style={{ width: "100%" }}
          label="Số lượng"
          name="quantity"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          style={{ width: "100%" }}
          label="Thể loại"
          name="category"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn thể loại",
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            options={[
              { value: "Arts", label: "Arts" },
              { value: "Business", label: "Business" },
              { value: "Comics", label: "Comics" },
              { value: "Cooking", label: "Cooking" },
              { value: "Entertainment", label: "Entertainment" },
              { value: "History", label: "History" },
              { value: "Music", label: "Music" },
              { value: "Sports", label: "Sports" },
              { value: "Teen", label: "Teen" },
              { value: "Travel", label: "Travel" },
            ]}
          />
        </Form.Item>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Ảnh Thumbnail</span>
          <label
            htmlFor="btnUploadUpdateBook"
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
            id="btnUploadUpdateBook"
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
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
              src={preview}
            />
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateBookModal;
