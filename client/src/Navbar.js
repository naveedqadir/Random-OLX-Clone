import React, { useState } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import { purple } from "@mui/material/colors";
import { cyan } from "@mui/material/colors";
import { red } from "@mui/material/colors";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
  IconButton,
} from "@chakra-ui/react";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import { ChatIcon } from "@chakra-ui/icons";

import logo from "./resources/logo.jpeg";
import Modallogin from "./Modallogin";
import Searchbar from "./SearchComponents/Searchbar";

export default function Navbar({ auth, setAuth }) {
  const [showNavNoTogglerSecond, setShowNavNoTogglerSecond] = useState(false);

  // for register and login
  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authemail");
    localStorage.removeItem("authname");
    localStorage.removeItem("authpicture");
    localStorage.removeItem("authphone");

    window.location.href = "/";
    setAuth(false);
  }
  const name = localStorage.getItem("authname");
  const picture = localStorage.getItem("authpicture");

  return (
    <div className="">
      <MDBNavbar
        expand="lg"
        style={{ backgroundColor: "rgba(235, 238, 239, 1)" }}
      >
        <MDBContainer fluid>
          <MDBNavbarBrand href="/">
            <img
              src={logo}
              height="45"
              className="logo"
              width="150"
              alt=""
              loading="lazy"
            />
          </MDBNavbarBrand>
          <MDBNavbarToggler
            type="button"
            data-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowNavNoTogglerSecond(!showNavNoTogglerSecond)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showNavNoTogglerSecond}>
            <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" href="/">
                  <strong style={{ color: "black" }}>Home</strong>
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <Searchbar />
              </MDBNavbarItem>
            </MDBNavbarNav>
            
            {auth === true && (
            <MDBNavbarLink>
              <a href="/chat">
              <IconButton
                variant="ghost"
                colorScheme="teal"
                aria-label="Send message"
                size="lg"
                icon={<ChatIcon />}
                _hover={{
                  border: "2px solid skyblue",
                }}
              />
              </a>
            </MDBNavbarLink>
            )}

            {auth === true && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  px={3}
                  py={2}
                  _hover={{
                    border: "2px solid skyblue",
                  }}
                >
                  <Avatar size={"sm"} src={picture} />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar size={"2xl"} src={picture} />
                  </Center>
                  <br />
                  <Center>
                    <p>{name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <a href="/editprofile">
                    <MenuItem>
                      <AccountBoxIcon sx={{ color: cyan[500] }} />
                      <span className="mx-2"> View/Edit Profile</span>
                    </MenuItem>
                  </a>
                  <a href="/myads">
                    <MenuItem>
                      <FavoriteTwoToneIcon sx={{ color: purple[500] }} />
                      <span className="mx-2">My Ads</span>
                    </MenuItem>
                  </a>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ color: red[500] }} />
                    <span className="mx-2">Logout</span>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            {auth === false && (
              <MDBBtn
                className="d-flex w-auto mb-3 mx-2 btn btn-primary mt-3"
                size="sm"
                onClick={toggleShow}
              >
                <span>
                  <MDBIcon className="mx-1" far icon="user-circle" size="lg" />
                  Login
                </span>
              </MDBBtn>
            )}
            <MDBBtn
              className="d-flex w-auto mb-3 mx-2 btn btn-info mt-3"
              size="lg"
              href="/sell"
            >
              <span>
                <MDBIcon className="mx-1" fas icon="shopping-cart" size="lg" />
                Sell
              </span>
            </MDBBtn>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      {/* Login/Register Modal */}
      <Modallogin
        setStaticModal={setStaticModal}
        toggleShow={toggleShow}
        staticModal={staticModal}
      />
    </div>
  );
}
