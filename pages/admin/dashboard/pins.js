import Head from "next/head";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useEffect, useContext, useReducer } from "react";
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { getError } from "../../../utils/error";
import { MapStore } from "../../../context/MapStore";
import { useSnackbar } from "notistack";
import Navbar from "../../../components/Navbar/Navbar";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, pins: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function AdminPins() {
  const { state } = useContext(MapStore);
  const router = useRouter();
  const { userInfo } = state;

  const [
    { loading, error, pins, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    pins: [],
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/pins`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteHandler = async (pinId) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/pins/${pinId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      enqueueSnackbar("Pin deleted successfully", { variant: "success" });
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <>
      <Head>
        <title>2ECHO-Dashboard-Admin-Pins</title>
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
                    fontSize: 32,
                    // textAlign: "center",
                    fontFamily: "Comfortaa",
                  }}
                >
                  {pins.pinsCount} Pins
                </Typography>
                {loadingDelete && <CircularProgress />}
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={{ color: "#f04040" }}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">ID</TableCell>
                          <TableCell align="center">USERNAME</TableCell>
                          <TableCell align="center">TITLE</TableCell>
                          <TableCell align="center">IMAGE</TableCell>
                          <TableCell align="center">DESCRIPTION</TableCell>
                          <TableCell align="center">RATING</TableCell>
                          <TableCell align="center">ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pins.pins.map((pin) => (
                          <TableRow key={pin._id}>
                            <TableCell align="center">
                              {pin._id.substring(20, 24)}
                            </TableCell>
                            <TableCell align="center">{pin.username}</TableCell>
                            <TableCell align="justify">{pin.title}</TableCell>
                            <TableCell align="justify">{pin.image}</TableCell>
                            <TableCell align="justify">
                              {pin.description}
                            </TableCell>
                            <TableCell align="center">{pin.rating}</TableCell>
                            <TableCell
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <NextLink
                                href={`/admin/dashboard/pin/${pin._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>{" "}
                              <Button
                                onClick={() => deleteHandler(pin._id)}
                                size="small"
                                variant="contained"
                                color="error"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default dynamic(() => Promise.resolve(AdminPins), { ssr: false });
