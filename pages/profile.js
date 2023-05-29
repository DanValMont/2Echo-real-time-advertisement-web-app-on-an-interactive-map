import Head from "next/head";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useEffect, useContext } from "react";
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
} from "@mui/material";
import { getError } from "../utils/error";
import { MapStore } from "../context/MapStore";
// import Layout from "../components/Layout";
// import useStyles from "../utils/styles";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar/Navbar";

function Profile() {
  const { state, dispatch } = useContext(MapStore);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  //   const classes = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }
    setValue("username", userInfo.username);
    setValue("email", userInfo.email);
  }, []);
  const submitHandler = async ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        {
          username,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));

      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    // <Layout title="Profile">
    <>
      <Head>
        <title>2ECHO-profile</title>
        <meta
          name="description"
          content="Welcome to Map Adventure travel App. A website App where you can share with your peers about interesting places to visit such as swap meets, street markets, expositions etc."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={{ marginTop: 10, marginBottom: 10 }}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card sx={{ marginTop: 10, marginBottom: 10 }}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Profile
                </Typography>
              </ListItem>
              <ListItem
                component="form"
                sx={{ width: "100%", maxWidth: 800, margin: "0 auto" }}
                onSubmit={handleSubmit(submitHandler)}
              >
                {/* <form
                  onSubmit={handleSubmit(submitHandler)}
                  //   className={classes.form}
                > */}
                <List>
                  <ListItem>
                    <Controller
                      name="username"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="username"
                          label="Username"
                          inputProps={{ type: "username" }}
                          error={Boolean(errors.username)}
                          helperText={
                            errors.username
                              ? errors.username.type === "minLength"
                                ? "Username length is more than 1"
                                : "Username is required"
                              : ""
                          }
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>
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
                        validate: (value) =>
                          value === "" ||
                          value.length > 5 ||
                          "Password length is more than 5",
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="password"
                          label="Password"
                          inputProps={{ type: "password" }}
                          error={Boolean(errors.password)}
                          helperText={
                            errors.password
                              ? "Password length is more than 5"
                              : ""
                          }
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      defaultValue=""
                      rules={{
                        validate: (value) =>
                          value === "" ||
                          value.length > 5 ||
                          "Confirm Password length is more than 5",
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="confirmPassword"
                          label="Confirm Password"
                          inputProps={{ type: "password" }}
                          error={Boolean(errors.confirmPassword)}
                          helperText={
                            errors.password
                              ? "Confirm Password length is more than 5"
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
                    >
                      Update
                    </Button>
                  </ListItem>
                </List>
                {/* </form> */}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
    // </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
