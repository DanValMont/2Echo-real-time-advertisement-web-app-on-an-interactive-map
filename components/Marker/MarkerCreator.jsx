import { useState, useRef, useContext } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  MenuItem
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { MapStore } from '../../context/MapStore';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import styles from "./MarkerCreator.module.css";

export default function MarkerCreator() {
        const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

        const { state, dispatch } = useContext(MapStore);
        const {userInfo, createdPin} = state;
        const { enqueueSnackbar } = useSnackbar();
        const [position, setPosition] = useState(null);
        const [title, setTitle] = useState(null);
        const [description, setDescription] = useState(null);
        const [star, setStar] = useState(0);

       useMapEvents({
          dblclick: (ev) => {

            userInfo ? setPosition(ev.latlng) : enqueueSnackbar("Please sign in or login to start creating content", { variant: "info" });
          },

          popupclose: () => {
      setPosition(null);
    },
        });
        
        const mapRef = useRef(null);

        const uploadHandler = async (e,imageField = "image") => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      const { data } = await axios.post("/api/users/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      setValue(imageField, data.secure_url);
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

        const submitHandler = async ({title, image, description, rating}) => {
              // e.preventDefault();
          const newPin = {
              username: userInfo.username, // check this!
              title,
              image,
              description,
              rating,
              latitude: position.lat,
              longitude: position.lng,
          };

          try {
               await axios.post("/api/pins", newPin);
               mapRef.current.closePopup();
               setValue("image", "");
               setValue("title", "");
               setValue("description", "");
               setValue("rating", "");
               dispatch({type: "CREATED_PIN", payload: true});
               enqueueSnackbar("Pin created successfully", { variant: "success" });
          } catch (err) {
            console.log(err);
            enqueueSnackbar(getError(err), { variant: "error" });
          }
        };

        const style = {
    width: "sm",
    height: 520,
    backgroundColor: "#ffffff",
    margin: "20 auto",
    p: 4
  };

        return position === null ? null : (
          
          <Marker icon={L.icon({iconUrl: "/2echo-logo-no-name.svg", shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', shadowSize: [41, 41], iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]})} ref={mapRef} position={position} >
       <Popup>
        <Box sx={style}>
          <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
            <Typography
              component="h1"
              variant="h1"
              sx={{
                fontSize: 24,
                textAlign: "center",
                fontFamily: "Comfortaa",
              }}
            >
              <NextLink href="/" passHref>
                <Link>               
                  <Image
                    src="/2echo-logo-no-name.svg"
                    alt="2echo"
                    className={styles.logo}
                    width={20}
                    height={20}
                  />
                </Link>
              </NextLink>
              New Pin
            </Typography>
            <List>
              <ListItem>
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 5,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="title"
                      label="Title"
                      error={Boolean(errors.title)}
                      helperText={
                        errors.title
                          ? errors.title.type === "minLength"
                            ? "Title length is more than 5"
                            : "Title is required"
                          : ""
                      }
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
                          required: false,
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
                    </ListItem>
              <ListItem>
                <Controller
                  name="description"
                  
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      
          id="description"
          label="Description"
          fullWidth
          multiline
          rows={2}
          // defaultValue=""
          variant="outlined"
                      error={Boolean(errors.description)}
                      helperText={
                        errors.description
                          ? errors.description.type === "minLength"
                            ? "description length is more than 5 characters"
                            : "Description is required"
                          : ""
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
                      helperText={
                        errors.rating
                            ? "rating is required"
                            : ""
                      }
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
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="primary"
                  sx={{ fontFamily: "Comfortaa", fontWeight: "bold" }}
                >
                  Add Pin
                </Button>
              </ListItem>
            </List>
          </form>
        </Box>
       </Popup>
       </Marker>
        );
      }