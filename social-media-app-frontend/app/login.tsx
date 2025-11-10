import { Formik } from "formik";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as Yup from "yup";


import { showToast } from "@/components/ToastProvider";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { loginUser } from "../store/slices/authSlice";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir email girin")
    .required("Email gerekli"),
  password: Yup.string()
    .min(6, "En az 6 karakter giriniz")
    .required("Şifre gerekli"),
});

// type Props = NativeStackScreenProps<RootStackParamList, 'login'>;

export default function Login() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  // const {loading, error, token} = useSelector((state: RootState) => state.auth)

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          
          dispatch(loginUser(values))
            .unwrap()
            .then(() => {
              router.push("/(tabs)");
            })
            .catch((err) => {
              showToast("error", "Something Went Wrong!")
            });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Text style={styles.title}>Hello,</Text>
            <Text style={styles.subtitle}>Welcome Back</Text>

            <View>
              <Text style={styles.inputTitle}>E-mail</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.email && touched.email ? styles.inputError : null,
                ]}
                placeholder={"Email"}
                onChangeText={handleChange("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
                // onBlur={handleBlur("email")}
              />
              <View style={styles.errorContainer}>
                {errors.email && touched.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
              </View>
            </View>

            <View>
              <Text style={styles.inputTitle}>Password</Text>

              <TextInput
                id="password"
                style={[
                  styles.input,
                  errors.password && touched.password
                    ? styles.inputError
                    : null,
                ]}
                placeholder={"Password"}
                secureTextEntry
                onChangeText={handleChange("password")}
                // onBlur={handleBlur("password")}
                value={values.password}
                autoCapitalize="none"
              />
              <View style={styles.errorContainer}>
                {errors.password && touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
              </View>
            </View>
            <Pressable style={styles.button} onPress={handleSubmit as any}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <View style={styles.signUpContainer}>
              <Text>or </Text>
              <Pressable onPress={() => router.replace("/register")}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </Pressable>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5A47AB",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 32,
    marginBottom: 50,
    textAlign: "center",
  },
  input: {
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    marginBottom: 5,
    // borderRadius: 100,
    minWidth: "100%",
  },
  inputError: {
    borderBottomWidth: 1,
    borderColor: "#DC2525",
    padding: 14,
    // marginBottom: 20,
    // borderRadius: 100,
    minWidth: "100%",
  },
  inputTitle: {
    marginTop: 10,
    paddingLeft: 14,
    fontSize: 16,
  },
  button: {
    minWidth: "100%",
    height: 50,
    backgroundColor: "#5A47AB",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: { color: "#DC2525", fontSize: 12 },
  errorContainer: {
    minHeight: 20,
    paddingLeft: 14,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "#5A47AB",
  },
});
