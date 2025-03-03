import { AuditOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [current, setCurrent] = useState("");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      label: <Link to={"/"}>Books</Link>,
      key: "books",
      icon: <AuditOutlined />,
    },
    {
      label: <Link to={"/users"}>Users</Link>,
      key: "users",
      icon: <UsergroupAddOutlined />,
    },
  ];

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;
