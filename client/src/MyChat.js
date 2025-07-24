import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTypography,
} from "mdb-react-ui-kit";
import CatNavbar from "./CatNavbar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import {
  CloseIcon,
  DeleteIcon,
  HamburgerIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import ForumIcon from "@mui/icons-material/Forum";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Inbox from "./ChatComponents/Inbox";
import FetchChat from "./ChatComponents/FetchChat";
import SendChat from "./ChatComponents/SendChat";
import Loading from "./resources/Loading";
import { getAvatarProps } from "./utils/imageUtils";

export default function MyChat() {
  const { id, useremail } = useParams();
  const toast = useToast();
  const authToken = localStorage.getItem("authToken");
  const authemail = localStorage.getItem("authemail");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState({});
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [ChatScreen, setChatScreen] = useState(false);

  useEffect(() => {
    if (id && useremail) {
      const fetchData = async () => {
        setChatScreen(true);
        try {
          const response = await axios.post(
            `${backendUrl}/previewad/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setProduct(response.data.product);
          setIsLoading(false); // Set loading state to false when data is fetched successfully
        } catch (error) {
          setChatScreen(false);
        }
      };
      fetchData();
      if (useremail === authemail) {
        setChatScreen(false);
      } else {
        setChatScreen(true);
        try{
          axios
            .get(`${backendUrl}/profilesearch?useremail=${useremail}`)
            .then((response) => {
              setProfileData(response.data);
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              setChatScreen(false);
            });
          }
          catch{
            setChatScreen(false);
          }
      }

    } else {
      setIsLoading(false);
    }
  }, [id, useremail, authToken, authemail, backendUrl]);

  if (isLoading) {
    return <Loading />;
  }

  const handleDelete = () => {
    setIsLoading(true);
    axios
      .post(
        `${backendUrl}/deletechat/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        setChatScreen(false);
        toast({
          title: "Chat Deleted",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: "No Chats Found",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <CatNavbar />
      <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
        <MDBRow>
          <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
            <Inbox />
          </MDBCol>

          <MDBCol md="6" lg="7" xl="8">
            {ChatScreen ? (
              <>
                <Card>
                  <CardBody style={{ display: "flex", alignItems: "center" }}>
                    <Link
                      to={`/profile/${useremail}`}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", marginRight: "0.5rem" }}>
                        <Image
                          boxSize="50px"
                          objectFit="cover"
                          src={product.productpic1 || "https://via.placeholder.com/50x50?text=No+Image"}
                          alt="Product Image"
                          borderRadius="md"
                          fallbackSrc="https://via.placeholder.com/50x50?text=No+Image"
                        />
                        <Avatar
                          {...getAvatarProps(product.ownerpicture, 40)}
                          alt="Product Owner"
                          size="sm"
                          ml={-2}
                          border="2px solid"
                          borderColor="gray.800"
                        />
                      </div>
                      <div style={{ marginLeft: "1rem" }}>
                        <Heading size="md">{profileData.name || "Unknown User"}</Heading>
                      </div>
                      <Avatar
                        {...getAvatarProps(profileData.picture, 32)}
                        alt="Message To"
                        size="sm"
                        className="mx-2"
                      />
                    </Link>
                    <div style={{ flexGrow: 1 }}></div>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<HamburgerIcon />}
                        variant="outline"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<DeleteIcon color="red.500" />}
                          command="⌘"
                          onClick={handleDelete}
                        >
                          Delete Chat
                        </MenuItem>
                        <MenuItem
                          as={Link}
                          to={`/preview_ad/${id}`}
                          icon={<ViewIcon color="green.500" />}
                          command="->"
                        >
                          See Product
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <Button
                      className="mx-2"
                      onClick={() => {
                        setChatScreen(false);
                      }}
                    >
                      <CloseIcon />
                    </Button>
                  </CardBody>
                  <Container style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ marginRight: "auto" }}>
                      Title: {product.title}
                    </p>
                    <p>
                      Price: <CurrencyRupeeIcon fontSize="small" />
                      {product.price}
                    </p>
                  </Container>
                </Card>
                <Divider />
                <MDBTypography listUnStyled>
                  {profileData && profileData.name ? (
                    <FetchChat id={id} toData={profileData} to={useremail} />
                  ) : (
                    <Loading />
                  )}
                  <SendChat id={id} to={useremail} />
                </MDBTypography>
              </>
            ) : (
              <>
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  minH="60vh"
                >
                  <ForumIcon style={{ color: "teal", fontSize: "60px" }} />
                  <b>Select a Chat to View Conversation</b>
                </Flex>
              </>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}
