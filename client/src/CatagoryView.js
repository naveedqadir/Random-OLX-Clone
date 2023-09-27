import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categories } from "./resources/Catagories";
import NotFound from "./resources/NotFound";
import axios from "axios";
import { Grid, GridItem } from "@chakra-ui/react";
import ProductCard from "./ProductCards/ProductCard";
import SearchNotFound from "./resources/SearchNotFound";
import CatNavbar from "./CatNavbar";
import Loading from "./resources/Loading";


export default function CatagoryView() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isValidCategory = categories.some(
    (cat) => cat.title.toLowerCase() === category.toLowerCase()
  );
  const isValidItem = categories.some((cat) => cat.items.includes(category));

  useEffect(() => {
    if (!isValidCategory && !isValidItem) {
      return;
    }

    const getProductsbyCategory = async () => {
      try {
        const response = await axios.get(`https://random-backend-yjzj.onrender.com/getProductsbyCategory/${category}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getProductsbyCategory();
  }, [category, isValidCategory, isValidItem]);

  if (!isValidCategory && !isValidItem) {
    return <NotFound />;
  }

  if (products.length === 0) {
    return <SearchNotFound />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <CatNavbar />
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
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
