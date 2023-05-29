import Head from "next/head";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useEffect, useContext, useReducer, useState } from "react";
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { getError } from "../../../../utils/error";
import { MapStore } from "../../../../context/MapStore";
// import Layout from "../../../components/Layout";
// import useStyles from "../../../utils/styles";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Navbar from "../../../../components/Navbar/Navbar";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

function UserEdit({ params }) {
  const userId = params.id;
  const { state } = useContext(MapStore);
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  //   const classes = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsAdmin(data.isAdmin);
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("username", data.username);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ name }) => {
    closeSnackbar();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          username,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("User updated successfully", { variant: "success" });
      router.push("/admin/dashborad/users");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <>
      <Head>
        <title>2ECHO - {`Edit User ${userId}`}</title>
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
              <NextLink href="/admin/dashboard/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/dashboard/pins" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Pins"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card sx={{ marginTop: 10, marginBottom: 10 }}>
            <List>
              <ListItem>
                <Typography
                  component="h1"
                  variant="h1"
                  sx={{
                    // fontSize: 24,
                    // textAlign: "center",
                    fontFamily: "Comfortaa",
                  }}
                >
                  Edit User {userId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography sx={{ color: "#f04040" }}>{error}</Typography>
                )}
              </ListItem>
              <ListItem
                component="form"
                sx={{ width: "100%", maxWidth: 800, margin: "0 auto" }}
                onSubmit={handleSubmit(submitHandler)}
              >
                {/* <form
                  onSubmit={handleSubmit(submitHandler)}
                  // className={classes.form}
                > */}
                <List>
                  <ListItem>
                    <Controller
                      name="username"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="username"
                          label="Username"
                          error={Boolean(errors.username)}
                          helperText={
                            errors.username ? "Username is required" : ""
                          }
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      label="Is Admin"
                      control={
                        <Checkbox
                          onClick={(e) => setIsAdmin(e.target.checked)}
                          checked={isAdmin}
                          name="isAdmin"
                        />
                      }
                    ></FormControlLabel>
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
                    {loadingUpdate && <CircularProgress />}
                  </ListItem>
                </List>
                {/* </form> */}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
