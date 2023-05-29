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
      return { ...state, loading: false, users: action.payload, error: "" };
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

function AdminUsers() {
  const { state } = useContext(MapStore);
  const router = useRouter();
  //   const classes = useStyles();
  const { userInfo } = state;

  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: "",
    });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/users`, {
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
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteHandler = async (userId) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      enqueueSnackbar("User deleted successfully", { variant: "success" });
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <>
      <Head>
        <title>2ECHO-Dashboard-Admin-Users</title>
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
                    fontSize: 32,
                    // textAlign: "center",
                    fontFamily: "Comfortaa",
                  }}
                >
                  {users.usersCount} Users
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
                          <TableCell align="center">EMAIL</TableCell>
                          <TableCell align="center">ISADMIN</TableCell>
                          <TableCell align="center">ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell align="center">
                              {user._id.substring(20, 24)}
                            </TableCell>
                            <TableCell align="center">
                              {user.username}
                            </TableCell>
                            <TableCell align="justify">{user.email}</TableCell>
                            <TableCell align="center">
                              {user.isAdmin ? "YES" : "NO"}
                            </TableCell>
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
                                href={`/admin/dashboard/user/${user._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>{" "}
                              <Button
                                onClick={() => deleteHandler(user._id)}
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

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });

//https://www.youtube.com/watch?v=oxFr7we3LC8
//https://dev.to/nilmadhabmondal/let-s-build-a-video-chat-app-with-javascript-and-webrtc-380b
//https://peerjs.com/docs/#start
//https://blog.logrocket.com/getting-started-peerjs/
//https://downloadly.ir/elearning/video-tutorials/webrtc-practical-course-create-video-chat-application/
