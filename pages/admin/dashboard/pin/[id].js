import Head from "next/head";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useEffect, useContext, useReducer } from "react";
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
  MenuItem,
} from "@mui/material";
import { getError } from "../../../../utils/error";
import { MapStore } from "../../../../context/MapStore";
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

function PinEdit({ params }) {
  const pinId = params.id;
  const { state } = useContext(MapStore);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/admin/pins/${pinId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("username", data.username);
          setValue("title", data.title);
          setValue("image", data.image);
          setValue("description", data.description);
          setValue("rating", data.rating);
          setValue("latitude", data.latitude);
          setValue("longitude", data.longitude);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadHandler = async (e, imageField = "image") => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/users/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.secure_url);
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const submitHandler = async ({
    username,
    title,
    image,
    description,
    rating,
    latitude,
    longitude,
  }) => {
    closeSnackbar();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/pins/${pinId}`,
        {
          username,
          title,
          image,
          description,
          rating,
          latitude,
          longitude,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("Pin updated successfully", { variant: "success" });
      router.push("/admin/dashboard/pins");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <>
      <Head>
        <title>2ECHO - {`Edit Pin ${pinId}`}</title>
        <meta
          name="description"
          content="Welcome to 2echo, a web application that allows anyone to post diverse ads and display them on an interactive, real-time map."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={{ marginTop: 10, marginBottom: 10 }}>
            <List>
              <NextLink href="/admin/dashboard/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/dashboard/pins" passHref>
                <ListItem selected button component="a">
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
                  Edit Product {pinId}
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
                    <Controller
                      name="title"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="title"
                          label="Title"
                          error={Boolean(errors.title)}
                          helperText={errors.title ? "Title is required" : ""}
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="image"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="image"
                          label="Image"
                          error={Boolean(errors.image)}
                          helperText={errors.image ? "Image is required" : ""}
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Button variant="contained" component="label">
                      Upload File
                      <input type="file" onChange={uploadHandler} hidden />
                    </Button>
                    {loadingUpload && <CircularProgress />}
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="description"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          multiline
                          id="description"
                          label="Description"
                          error={Boolean(errors.description)}
                          helperText={
                            errors.description ? "Description is required" : ""
                          }
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="rating"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <TextField
                          id="rating"
                          label="Rating"
                          fullWidth
                          select
                          variant="outlined"
                          defaultValue=""
                          error={Boolean(errors.rating)}
                          helperText={errors.rating ? "rating is required" : ""}
                          {...field}
                        >
                          <MenuItem value="1">1</MenuItem>
                          <MenuItem value="2">2</MenuItem>
                          <MenuItem value="3">3</MenuItem>
                          <MenuItem value="4">4</MenuItem>
                          <MenuItem value="5">5</MenuItem>
                        </TextField>
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="latitude"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="latitude"
                          label="Latitude"
                          error={Boolean(errors.latitude)}
                          helperText={
                            errors.latitude ? "Latitude is required" : ""
                          }
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="longitude"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="longitude"
                          label="Longitude"
                          error={Boolean(errors.longitude)}
                          helperText={
                            errors.longitude ? "Longitude is required" : ""
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
                    {loadingUpdate && <CircularProgress />}
                  </ListItem>
                </List>
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

export default dynamic(() => Promise.resolve(PinEdit), { ssr: false });
