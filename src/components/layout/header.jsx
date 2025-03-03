import {
  AliwangwangOutlined,
  AuditOutlined,
  LoginOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Menu, message } from "antd";
import { Children, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { logoutAPI } from "../../services/api.service";

const Header = () => {
  const [current, setCurrent] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location && location.pathname) {
      const allRoutes = ["", "users"];
      const currentRoute = allRoutes.find(
        (item) => `/${item}` === location.pathname
      );
      if (currentRoute) {
        setCurrent(currentRoute);
      } else {
        setCurrent("");
      }
    }
  }, [location]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      localStorage.removeItem("access_token");
      setUser({
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
      });
      message.success("Đăng xuất thành công.");
    }
    navigate("/login");
  };

  const items = [
    {
      label: <Link to={"/"}>Books</Link>,
      key: "",
      icon: <AuditOutlined />,
    },
    {
      label: <Link to={"/users"}>Users</Link>,
      key: "users",
      icon: <UsergroupAddOutlined />,
    },

    ...(!user.id
      ? [
          {
            label: <Link to={"login"}>Đăng nhập</Link>,
            key: "login",
            icon: <LoginOutlined />,
          },
        ]
      : []),

    ...(user.id
      ? [
          {
            label: `Chào mừng ${user.fullName}`,
            key: "settings",
            icon: <AliwangwangOutlined />,
            children: [
              {
                label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
                key: "logout",
              },
            ],
          },
        ]
      : []),
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
