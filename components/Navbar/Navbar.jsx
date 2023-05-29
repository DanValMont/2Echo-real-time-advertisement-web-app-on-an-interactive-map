import { useContext, useState } from 'react'
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Link,
  Button,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  InputBase,
  IconButton,
  //ClickAwayListener,
} from "@mui/material";
import styles from "./Navbar.module.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { MapStore } from "../../context/MapStore";
import Cookies from "js-cookie";
//
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(MapStore);
  const { userInfo } = state;

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    router.push("/login");
  };

  //

  const isDesktop = useMediaQuery("(min-width:600px)");

  const [query, setQuery] = useState("");

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // router.push(`/search?query=${query}`);
    router.replace(`/search?query=${query}`);
  };

  //

  return (
    <div>
       <AppBar position="static" sx={{backgroundColor: "#ffffff", position: "absolute", top: 0, left: 0, zIndex: 1000000}}>
          <Toolbar className={styles.toolbar}>
            <Box display="flex" alignItems="center">
              {/* <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                className={styles.menuButton}
              >
                <MenuIcon className={styles.navbarButton} />
              </IconButton> */}
              <NextLink href="/" passHref>
                <Link>
                {!isDesktop ? (<img
                      src="/2echo-logo-no-name.svg"
                      alt="2echo-logo"
                      className={styles.logo_no_name}
                    />) : (<img
                      src="/2echo-logo.svg"
                      alt="2echo-logo"
                      className={styles.logo}
                    />)}
                    
                </Link>
              </NextLink>
            </Box>
            
            {/* <Box className={isDesktop ? styles.visible : styles.hidden}> */}
              <Box>
              <form onSubmit={submitHandler} className={styles.searchForm}>
                <InputBase
                  name="query"
                  // className={styles.searchInput}
                  sx={{ paddingLeft: 2, color: "#000000", fontFamily: "Comfortaa", "& ::placeholder": { color: "#606060", fontFamily: "Comfortaa",}, }}
                  placeholder="Search name of products, brands, places"
                  onChange={(e) => queryChangeHandler(e)}
                />
                <IconButton
                  type="submit"
                  // className={styles.iconButton} #64a6fc 1px solid #64a6fc    
                  sx={{ backgroundColor: "transparent", padding: "5px", border: "none", borderRadius: "0 100px 100px 0", "& span": { color: "#000000", }, }}
                  aria-label="search"
                  
                >
                  <SearchIcon />
                </IconButton>
              </form>
            </Box>

            <Box>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={styles.navbarButton}
                    sx={{":hover": {backgroundColor: "transparent"}}}
                  >
                    <Tooltip title={userInfo.username} arrow >
                      <AccountCircleIcon sx={{fontSize: 37, color: "#64a6fc", marginRight: "-25px"}} />
                    </Tooltip>
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={(e) => loginMenuCloseHandler(e)}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                    >
                      Profile
                    </MenuItem>
                    {userInfo.isAdmin ? (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/admin/dashboard/users")
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    ) : (<MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/user/dashboard/pins")
                        }
                      >
                        Dashboard
                      </MenuItem>)}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                    <Button className={styles.navbarButton} sx={{":hover": {backgroundColor: "transparent"}}} >
                      <Tooltip title="Login" arrow>
                        <AccountCircleIcon sx={{fontSize: 37, color: "#64a6fc", marginRight: "-25px"}}/>
                      </Tooltip>
                    </Button>
                  </Link>
                </NextLink>
              )}
            </Box>
          </Toolbar>
          {/* {!isDesktop && (
            <Box display="flex" justifyContent="center" margin={0.75}>
              <form
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
                onSubmit={submitHandler}
                className={styles.searchForm}
              >
                <InputBase
                  name="query"
                  // className={classes.searchInput}
                  sx={{ paddingLeft: 2, color: "#000000", fontFamily: "Comfortaa", "& ::placeholder": { color: "#606060", fontFamily: "Comfortaa",}, }}
                  placeholder="Search name of products, brands, places"
                  onChange={queryChangeHandler}
                />
                <IconButton
                  type="submit"
                  // className={classes.iconButton}
                  sx={{ backgroundColor: "#64a6fc", padding: "5px", border: "1px solid #64a6fc", borderRadius: "0 5px 5px 0", "& span": { color: "#000000", }, }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </form>
            </Box>
          )} */}
        </AppBar>
    </div>
  )
}

export default Navbar;