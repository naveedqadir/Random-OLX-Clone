import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, InputGroup, InputRightElement, IconButton, Box } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

export default function Searchbar() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/results?query=${encodeURIComponent(input)}`);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <InputGroup size="md">
        <Input
          pr="3rem"
          type="text"
          placeholder="Search for anything..."
          value={input}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          borderRadius="full"
          border="2px solid"
          borderColor={isFocused ? "purple.400" : "gray.200"}
          bg="white"
          h="44px"
          _placeholder={{ color: 'gray.400' }}
          _hover={{
            borderColor: "gray.300"
          }}
          _focus={{
            borderColor: "purple.400",
            boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.1)",
          }}
          transition="all 0.2s"
        />
        <InputRightElement width="3rem" h="full">
          <IconButton
            h="32px"
            w="32px"
            size="sm"
            icon={<SearchIcon boxSize={3} />}
            bgGradient="linear(135deg, #0ea5e9, #7c3aed)"
            color="white"
            onClick={onSubmit}
            aria-label="Search"
            isRound
            _hover={{
              bgGradient: "linear(135deg, #0284c7, #6d28d9)",
              transform: "scale(1.05)"
            }}
            transition="all 0.2s"
          />
        </InputRightElement>
      </InputGroup>
    </form>
  );
}
