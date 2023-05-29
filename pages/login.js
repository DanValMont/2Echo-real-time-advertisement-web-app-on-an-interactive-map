import Head from "next/head";
import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
  Link,
  Box,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useContext, useEffect } from "react";
import { MapStore } from "../context/MapStore";
import { getError } from "../utils/error";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import styles from "../styles/Login.module.css";

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(MapStore);
  const { userInfo } = state;

  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    // alignContent: "center",
    maxWidth: "md",
    minWidth: "sm",
    backgroundColor: "rgba(17, 25, 40, 0.75)",
    margin: "20 auto",
    // zIndex: 999,
    // border: "2px solid #000",
    // boxShadow: 24,
    // boxShadow: "0 20 50 rgba(#000, .1)",
    backdropFilter: "blur(16px) saturate(180%)",
    borderRadius: 2,
    border: "1px solid rgba(255, 255, 255, 0.125)",
    color: "#ffffff",
    p: 4,
  };

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  const submitHandler = async ({ email, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });

      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      router.push("/");
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  //https://ui.glass/generator/
  //https://smartdevpreneur.com/override-textfield-border-color-in-material-ui/

  return (
    <>
      <Head>
        <title>2ECHO-login</title>
        <meta
          name="description"
          content="Welcome to Map Adventure travel App. A website App where you can share with your peers about interesting places to visit such as swap meets, street markets, expositions etc."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.background_image}>
        <Box sx={style}>
          <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
            <Typography
              component="h1"
              variant="h1"
              sx={{
                fontSize: 32,
                textAlign: "center",
                fontFamily: "Comfortaa",
              }}
            >
              <NextLink href="/" passHref>
                <Link
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    width: "45px",
                  }}
                >
                  <img
                    src="/2echo-logo-no-name.svg"
                    alt="2echo"
                    className={styles.logo}
                  />
                </Link>
              </NextLink>
              Login
            </Typography>
            <List>
              <ListItem>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      // sx={{ color: "#ffffff", fontFamily: "Comfortaa" }}
                      sx={{
                        "& .MuiOutlinedInput-root:hover": {
                          "& > fieldset": {
                            borderColor: "#0f477e",
                          },
                        },
                        label: {
                          color: "#ffffff",
                          fontFamily: "Comfortaa",
                        },
                        fieldset: {
                          borderColor: "#ffffff",
                        },
                        input: {
                          color: "#ffffff",
                        },
                      }}
                      // InputLabelProps={{
                      //   style: { color: "#fff", fontFamily: "Comfortaa" },
                      // }}
                      fullWidth
                      id="email"
                      label="Email"
                      inputProps={{ type: "email" }}
                      error={Boolean(errors.email)}
                      helperText={
                        errors.email
                          ? errors.email.type === "pattern"
                            ? "Email is not valid"
                            : "Email is required"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="password"
                      label="Password"
                      inputProps={{ type: "password" }}
                      sx={{
                        "& .MuiOutlinedInput-root:hover": {
                          "& > fieldset": {
                            borderColor: "#0f477e",
                          },
                        },
                        label: {
                          color: "#ffffff",
                          fontFamily: "Comfortaa",
                        },
                        fieldset: {
                          borderColor: "#ffffff",
                        },
                        input: {
                          color: "#ffffff",
                        },
                      }}
                      error={Boolean(errors.password)}
                      helperText={
                        errors.password
                          ? errors.password.type === "minLength"
                            ? "Password length is more than 5"
                            : "Password is required"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="primary"
                  sx={{ fontFamily: "Comfortaa", fontWeight: "bold" }}
                >
                  Login
                </Button>
              </ListItem>
              <ListItem>
                Don&apos;t have an account? &nbsp;
                <NextLink href="/register" passHref>
                  <Link>Register</Link>
                </NextLink>
              </ListItem>
            </List>
          </form>
        </Box>
      </div>
    </>
  );
}
