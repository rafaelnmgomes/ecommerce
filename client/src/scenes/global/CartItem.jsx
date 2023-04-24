import styled from "@emotion/styled";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { decreaseCount, increaseCount, removeFromCart } from "../../state";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../../theme";

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <Box key={`${item.attributes.name}-${item.id}`}>
      <FlexBox p="15px 0">
        <Box flex="1 1 40%">
          <img
            alt={item?.name}
            width="123px"
            height="164px"
            src={`${process.env.REACT_APP_BASE_URL}/${item?.attributes?.image?.data?.attributes?.formats?.medium?.url}`}
          />
        </Box>
        <Box flex="1 1 60%">
          <FlexBox mb="5px">
            <Typography fontWeight="bold">{item.attributes.name}</Typography>
            <IconButton
              onClick={() => dispatch(removeFromCart({ id: item.id }))}
            >
              <CloseIcon />
            </IconButton>
          </FlexBox>
          <Typography>{item.attributes.shortDescription}</Typography>
          <FlexBox m="15px 0">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid ${shades.neutral[500]}`}
            >
              <IconButton
                onClick={() => dispatch(decreaseCount({ id: item.id }))}
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{item.count}</Typography>
              <IconButton
                onClick={() => dispatch(increaseCount({ id: item.id }))}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Typography fontWeight="bold">{item.attributes.price}</Typography>
          </FlexBox>
        </Box>
      </FlexBox>
      <Divider />
    </Box>
  );
};

export default CartItem;
