import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CatNavbar from '../CatNavbar';
import { Box, Container, Grid, GridItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCards/ProductCard';
import SearchNotFound from '../resources/SearchNotFound';
import NotFound from '../resources/NotFound';
import Loading from '../resources/Loading';

export default function SearchResults() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('query');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://random-backend-yjzj.onrender.com/search?q=${query}`);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  if (loading) {
    return <Loading />;
  }

if (results.length === 0) {
    return <SearchNotFound />;
}

  if (error) {
    return <NotFound />;
  }

  return (
    <Box>
      <CatNavbar />
      <Container maxW="container.xl">
      <Grid templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" }} gap={6}>
        {results.map((product) => (
          <GridItem key={product._id}>
            <Link to={`/preview_ad/${product._id}`}>
              <ProductCard product={product} />
            </Link>
          </GridItem>
        ))}
      </Grid>
      </Container>
    </Box>
  );
}
