import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import {
  Box,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import NotListedAnything from "./resources/NotListedAnything";
import ProductCardProfile from "./ProductCards/ProductCardProfile";

function MyadCards() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("/myads_view", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setAds(data);
      setIsLoading(false);
    };
    fetchAds();
  }, []);

  if (ads.length === 0){
    return <NotListedAnything />
  }

  return (
    <div>
      {isLoading ? (
        <div className="back">
          <div className="lo-container">
            <ReactLoading
              type="spin"
              color="green"
              height={"10%"}
              width={"10%"}
            />
          </div>
        </div>
      ) : (
        <>
          <Box className="container" p={5}>
            <Heading size="lg" mb={4}>
              Your Products
            </Heading>
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
              {ads.map((ad) => (
                <ProductCardProfile ad={ad}/>
              ))}
            </SimpleGrid>
          </Box>
        </>
      )}
    </div>
  );
}

export default MyadCards;
