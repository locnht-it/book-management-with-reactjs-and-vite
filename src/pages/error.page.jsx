import { Button, Result } from "antd";
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <Result
      status="404"
      title="Oops!"
      subTitle={error.statusText || error.message}
      extra={
        <Button type="primary">
          <Link to="/">
            <span>Trở về trang chủ</span>
          </Link>
        </Button>
      }
    />
  );
};

export default ErrorPage;
