import { Box, Button, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import { shades } from "../../theme";
import { setIsCartOpen } from "../../state";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "./CartItem";

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  const totalPrice = cart.reduce(
    (total, item) => total + item.attributes.price * item.count,
    0
  );

  return (
    <Box
      display={isCartOpen ? "block" : "none"}
      backgroundColor="rgba(0, 0, 0, 0.4)"
      position="fixed"
      zIndex={10}
      width="100%"
      height="100%"
      left="0"
      top="0"
      overflow="auto"
    >
      <Box
        position="fixed"
        right="0"
        bottom="0"
        width="max(400px, 30%)"
        height="100%"
        backgroundColor="white"
      >
        <Box padding="30px" overflow="auto" height="100%">
          <FlexBox mb="15px">
            <Typography variant="h3">SHOPPING BAG ({cart.length})</Typography>
            <IconButton onClick={() => dispatch(setIsCartOpen())}>
              <CloseIcon />
            </IconButton>
          </FlexBox>
          <Box>
            {cart.map((item, index) => (
              <CartItem key={`${item?.name}-${index}`} item={item} />
            ))}
            <Box m="20px 0">
              <FlexBox m="20px 0">
                <Typography fontWeight="bold">SUBTOTAL</Typography>
                <Typography fontWeight="bold">${totalPrice}</Typography>
              </FlexBox>
              <Button
                sx={{
                  backgroundColor: shades.primary[400],
                  color: "white",
                  borderRadius: "0",
                  minWidth: "100%",
                  padding: "20px 40px",
                  m: "20px 0",
                }}
                onClick={() => {
                  navigate("/checkout");
                  dispatch(setIsCartOpen());
                }}
              >
                CHECKOUT
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartMenu;
