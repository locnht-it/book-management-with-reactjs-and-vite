import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
} from "antd";
import { useState } from "react";
import { createBookAPI, handleUploadFileAPI } from "../../services/api.service";

const CreateBookForm = (props) => {
  const { loadBook } = props;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOnChangeFile = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      selectedFile(null);
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
    if (!selectedFile) {
      notification.error({
        message: "Tạo sách không thành công",
        description: "Vui lòng upload ảnh thumbnail",
      });
      return;
    }

    setLoading(true);

    // Step 1: Upload file
    const resUpload = await handleUploadFileAPI(selectedFile, "book");
    if (resUpload.data) {
      // Success
      const newThumbnail = resUpload.data.fileUploaded;

      // Step 2: Create book
      const { mainText, author, price, quantity, category } = values;
      const res = await createBookAPI(
        newThumbnail,
        mainText,
        author,
        price,
        quantity,
        category
      );

      if (res.data) {
        notification.success({
          message: "Tạo sách",
          description: "Tạo mới sách thành công",
        });
        resetAndCloseModal();
        await loadBook();
      } else {
        notification.error({
          message: "Tạo sách không thành công",
          description: JSON.stringify(res.message),
        });
      }
    } else {
      notification.error({
        message: "Upload ảnh thumbnail không thành công",
        description: JSON.stringify(resUpload.message),
      });
    }

    setLoading(false);
  };

  const resetAndCloseModal = () => {
    form.resetFields();
    setSelectedFile(null);
    setPreview(null);
    setIsModalOpen(false);
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Table Books</h3>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          Create Book
        </Button>
      </div>

      <Modal
        title="Tạo mới sách"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => resetAndCloseModal()}
        maskClosable={false}
        okText={"TẠO"}
        cancelText={"Hủy"}
        okButtonProps={{ loading: loading }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitBtn}>
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
                message: "Vui lòng nhập tên tác giả!",
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
                message: "Vui lòng nhập giá tiền!",
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
                message: "Vui lòng nhập số lượng!",
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
                message: "Vui lòng chọn thể loại!",
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
              htmlFor="btnUpload"
              style={{
                display: "block",
                width: "fit-content",
                marginTop: "15px",
                padding: "5px 10px",
                background: "Orange",
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
    </div>
  );
};

export default CreateBookForm;
