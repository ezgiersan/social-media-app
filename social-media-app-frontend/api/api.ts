
import axiosClient from "./axiosClient";

export const getData = async <T>(url: string): Promise<T> => {  
  const res = await axiosClient.get<T>(url);
  return res.data;
};

export const postData = async <T, U>(url: string, body: T): Promise<U> => {
  const res = await axiosClient.post<U>(url, body);
  return res.data;
};

export const postFormData = async <U>(url: string, formData: FormData): Promise<U> => {
  const res = await axiosClient.post<U>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const putFormData = async <U>(url: string, formData: FormData): Promise<U> => {
  const res = await axiosClient.put<U>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const putData = async <T, U>(url: string, body: T): Promise<U> => {
  const res = await axiosClient.put<U>(url, body);
  return res.data;
};

export const deleteData = async <U>(url: string): Promise<U> => {
  const res = await axiosClient.delete<U>(url);
  return res.data;
};