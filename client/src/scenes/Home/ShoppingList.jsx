import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box, Typography, useMediaQuery } from "@mui/material";
import Item from "../../components/Item";
import { setItems } from "../../state";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("all");
  const items = useSelector((state) => state.cart.items);
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  async function fetchItems() {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/items?populate=image`,
      { method: "GET" }
    );
    const items = await response.json();
    dispatch(setItems(items.data));
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!items) {
    return <div>Loading</div>;
  }

  const topRatedItems = items.filter(
    (item) => item.attributes.category === "topRated"
  );
  const newArrivalsItems = items.filter(
    (item) => item.attributes.category === "newArrivals"
  );
  const bestSellersItems = items.filter(
    (item) => item.attributes.category === "bestSellers"
  );

  return (
    <Box width="80%" margin="80px auto">
      <Typography vairant="h3" textAlign="center">
        Our Featured <b>Products</b>
      </Typography>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: isNonMobile ? "block" : "none" } }}
        sx={{
          m: "25px",
          "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
          },
        }}
      >
        <Tab label="ALL" value="all" />
        <Tab label="TOP RATED" value="topRated" />
        <Tab label="NEW ARRIVALS" value="newArrivals" />
        <Tab label="BEST SELLERS" value="bestSellers" />
      </Tabs>
      <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {value === "all" &&
          items.map((item) => (
            <Item key={`${item.name}-${item.id}`} item={item} />
          ))}
        {value === "topRated" &&
          topRatedItems.map((item) => (
            <Item key={`${item.name}-${item.id}`} item={item} />
          ))}
        {value === "newArrivals" &&
          newArrivalsItems.map((item) => (
            <Item key={`${item.name}-${item.id}`} item={item} />
          ))}
        {value === "bestSellers" &&
          bestSellersItems.map((item) => (
            <Item key={`${item.name}-${item.id}`} item={item} />
          ))}
      </Box>
    </Box>
  );
};

export default ShoppingList;
