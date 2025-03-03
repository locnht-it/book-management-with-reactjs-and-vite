import { Button, Form, Input, Modal, notification } from "antd";
import { useState } from "react";
import { createUserAPI } from "../../services/api.service";

const CreateUserModal = (props) => {
  const { loadUser } = props;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitBtn = async (values) => {
    setLoading(true);
    const { fullName, email, password, phone } = values;
    const res = await createUserAPI(fullName, email, password, phone);
    if (res.data) {
      notification.success({
        message: "Tạo mới người dùng",
        description: "Tạo mới người dùng thành công",
      });
      resetAndCloseModal();
      await loadUser();
    } else {
      notification.error({
        message: "Tạo mới người dùng không thành công",
        description: JSON.stringify(res.message),
      });
    }
    setLoading(false);
  };

  const resetAndCloseModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Table Users</h3>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          Create User
        </Button>
      </div>

      <Modal
        title="Tạo mới người dùng"
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
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password />
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
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserModal;
