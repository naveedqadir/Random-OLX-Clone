import React, { useEffect, useState } from "react";
import {Grid, GridItem} from "@chakra-ui/react";
import CatNavbar from "./CatNavbar";
import ProductCard from "./ProductCards/ProductCard";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "./resources/Loading";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const response = await axios.get("/getProducts");
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <CatNavbar />
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {products.map((product) => (
          <GridItem key={product._id}>
            <Link to={`/preview_ad/${product._id}`}>
              <ProductCard product={product} />
            </Link>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
