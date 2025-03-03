import axios from "./axios.customize";

const fetchAllBookAPI = (current, pageSize) => {
  const URL_BACKEND = `/api/v1/book?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};

const handleUploadFileAPI = (file, folder) => {
  const URL_BACKEND = `/api/v1/file/upload`;
  let config = {
    headers: {
      "upload-type": folder,
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", file);
  return axios.post(URL_BACKEND, bodyFormData, config);
};

const createBookAPI = (
  thumbnail,
  mainText,
  author,
  price,
  quantity,
  category
) => {
  const URL_BACKEND = `/api/v1/book`;
  const data = {
    thumbnail: thumbnail,
    mainText: mainText,
    author: author,
    price: price,
    quantity: quantity,
    category: category,
  };
  return axios.post(URL_BACKEND, data);
};

const updateBookAPI = (
  _id,
  thumbnail,
  mainText,
  author,
  price,
  quantity,
  category
) => {
  const URL_BACKEND = `/api/v1/book`;
  const data = {
    _id: _id,
    thumbnail: thumbnail,
    mainText: mainText,
    author: author,
    price: price,
    quantity: quantity,
    category: category,
  };
  return axios.put(URL_BACKEND, data);
};

const deleteBookAPI = (id) => {
  const URL_BACKEND = `/api/v1/book/${id}`;
  return axios.delete(URL_BACKEND);
};

const fetchAllUserAPI = (current, pageSize) => {
  const URL_BACKEND = `/api/v1/user?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_BACKEND);
};

const createUserAPI = (fullName, email, password, phone) => {
  const URL_BACKEND = `/api/v1/user`;
  const data = {
    fullName: fullName,
    email: email,
    password: password,
    phone: phone,
  };
  return axios.post(URL_BACKEND, data);
};

const updateUserAPI = (_id, fullName, phone, avatar) => {
  const URL_BACKEND = `/api/v1/user`;
  const data = {
    _id: _id,
    fullName: fullName,
    phone: phone,
    avatar: avatar,
  };
  return axios.put(URL_BACKEND, data);
};

export {
  fetchAllBookAPI,
  handleUploadFileAPI,
  createBookAPI,
  updateBookAPI,
  deleteBookAPI,
  fetchAllUserAPI,
  createUserAPI,
  updateUserAPI,
};
