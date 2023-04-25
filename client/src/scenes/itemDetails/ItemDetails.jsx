import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, IconButton, Typography, Tabs, Tab } from "@mui/material";
import { Add, Remove, FavoriteBorderOutlined } from "@mui/icons-material";
import { shades } from "../../theme";
import { addToCart } from "../../state";
import { useParams } from "react-router-dom";
import Item from "../../components/Item";

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItem() {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/items/${itemId}?populate=image`,
      {
        method: "GET",
      }
    );
    const item = await response.json();
    setItem(item.data);
  }

  async function getItems() {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/items?populate=image`,
      {
        method: "GET",
      }
    );
    const items = await response.json();
    const filteredItems = items.data.filter(
      (item) => item.id.toString() !== itemId
    );
    setItems(filteredItems);
  }

  useEffect(() => {
    getItem();
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  return (
    <Box width="80%" m="80px auto">
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        <Box flex="1 1 40%" mb="40px">
          <img
            alt={item?.name}
            width="100%"
            height="100%"
            src={`${process.env.REACT_APP_BASE_URL}${item?.attributes?.image?.data?.attributes?.formats?.medium?.url}`}
            style={{ objectFit: "contain" }}
          />
        </Box>
        <Box flex="1 1 50%" mb="40px">
          <Box display="flex" justifyContent="space-between">
            <Box>Home/Item</Box>
            <Box>Prev Next</Box>
          </Box>
          <Box m="65px 0 25px 0">
            <Typography variant="h3">{item?.attributes?.name}</Typography>
            <Typography>${item?.attributes?.price}</Typography>
            <Typography>{item?.attributes?.longDescription}</Typography>
          </Box>

          <Box display="flex" alignItems="center" minHeight="50px">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid ${shades.neutral[300]}`}
              mr="20px"
              p="2px 5px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <Remove />
              </IconButton>
              <Typography sx={{ p: "0 5px" }}>{count}</Typography>
              <IconButton onClick={() => setCount(Math.max(count + 1, 1))}>
                <Add />
              </IconButton>
            </Box>
            <Button
              sx={{
                backgroundColor: "#222222",
                color: "white",
                borderRadius: 0,
                minWidth: "150px",
                padding: "10px 40px",
              }}
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
            >
              ADD TO CART
            </Button>
          </Box>
          <Box>
            <Box m="20px 0 5px 0" display="flex">
              <FavoriteBorderOutlined />
              <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
            </Box>
            <Typography>CATEGORIES: {item?.attributes?.category}</Typography>
          </Box>
        </Box>
      </Box>
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="DESCRIPTION" value="description" />
          <Tab label="REVIEWS" value="reviews" />
        </Tabs>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="15px">
        {value === "description" && (
          <div>{item?.attributes?.longDescription}</div>
        )}
        {value === "reviews" && <div>reviews</div>}
      </Box>
      <Box mt="50px" width="100%">
        <Typography variant="h3" fontWeight="bold">
          Related Products
        </Typography>
        <Box
          mt="20px"
          display="flex"
          flexWrap="wrap"
          columnGap="1.33%"
          justifyContent="space-between"
        >
          {items.slice(0, 3).map((item, index) => (
            <Item key={`${item.name}-${index}`} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemDetails;
