import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export const showToast = (
  type: "success" | "error" | "info",
  text1: string,
  text2?: string
) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{  
        backgroundColor: "#22c55e",
        borderLeftColor: "#16a34a", 
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5, // Android gölgesi
        marginHorizontal: 10,
       }}
       contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 8,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
      }}
      text2Style={{
        fontSize: 14,
        color: "#f0fdf4",
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ 
        backgroundColor: "#ef4444", // canlı kırmızı
        borderLeftColor: "#b91c1c", // koyu kırmızı ton
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5,
        marginHorizontal: 10,
       }}
       contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 8,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
      }}
      text2Style={{
        fontSize: 14,
        color: "#fee2e2",
      }}
    />
  ),
};

const ToastProvider = () => {
  return (
    <Toast
      config={toastConfig}
      position= "bottom"
      bottomOffset={100}
      swipeable
    />
  );
};

export default ToastProvider;
