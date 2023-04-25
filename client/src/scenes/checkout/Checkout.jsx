import { useSelector } from "react-redux";
import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import Shipping from "./Shipping";
import { shades } from "../../theme";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51N0nObH16lNFOwZ5CjAhljm5kdEvB9zI1LW0VOaYEdxcQ3xN4qWSwlrluoUo7pM1nzDXM6jelTFUstrYIqQtLfaE00lL4av4Bt"
);

const initialValues = {
  billingAddress: {
    firstName: "",
    lastName: "",
    street2: "",
    street1: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
  shippingAddress: {
    isSameAddress: true,
    firstName: "",
    lastName: "",
    street2: "",
    street1: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
  email: "",
  phone: "",
};

const checkoutSchema = yup.object().shape({
  billingAddress: yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    street1: yup.string().required("Street is required"),
    street2: yup.string(),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    postalCode: yup.string().required("Postal code is required"),
  }),
  shippingAddress: yup.object().shape({
    isSameAddress: yup.boolean(),
    firstName: yup.string().when("isSameAddress", {
      is: false,
      then: yup.string().required("First name is required"),
    }),
    lastName: yup.string().when("isSameAddress", {
      is: false,
      then: yup.string().required("Last name is required"),
    }),
    street1: yup.string().when("isSameAddress", {
      is: false,
      then: yup.string().required("Street is required"),
    }),
    street2: yup.string(),
    city: yup.string().when("isSameAddress", {
      is: false,
      then: yup.string().required("City is required"),
    }),
    state: yup.string().when("isSameAddress", {
      is: false,
      then: yup.string().required("State is required"),
    }),
    country: yup.string().when("isSameAddress", {
      is: false,
      then: yup.string().required("Country is required"),
    }),
    postalCode: yup.string().when("isSameAddress", {
      is: false,
      then: yup.string().required("Postal code is required"),
    }),
  }),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone is required"),
});

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cart = useSelector((state) => state.cart.cart);
  const isFirstStep = activeStep === 0;
  const isSecondStep = activeStep === 1;

  const handleFormSubmit = async (values, actions) => {
    setActiveStep(activeStep + 1);

    if (isFirstStep && values.shippingAddress.isSameAddress) {
      actions.setFieldValue("shippingAddress", {
        ...values.billingAddress,
        isSameAddress: true,
      });
    }

    if (isSecondStep) {
      makePayment(values);
    }

    actions.setTouched({});
  };

  async function makePayment(values) {
    const stripe = await stripePromise;
    const requestBody = {
      userName: [
        values.billingAddress.firstName,
        values.billingAddress.lastName,
      ].join(" "),
      email: values.email,
      products: cart.map(({ id, count }) => ({
        id,
        count,
      })),
    };

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );
    console.log(
      "🚀 ~ file: Checkout.jsx:135 ~ makePayment ~ response:",
      response
    );

    const session = await response.json();
    console.log(
      "🚀 ~ file: Checkout.jsx:136 ~ makePayment ~ session:",
      session
    );
    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  }

  return (
    <Box width="80%" m="100px auto">
      <Stepper activeStep={activeStep} sx={{ m: "20px 0" }}>
        <Step>
          <StepLabel>Billing</StepLabel>
        </Step>
        <Step>
          <StepLabel>Payment</StepLabel>
        </Step>
      </Stepper>
      <Box>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema[activeStep]}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              {isFirstStep && (
                <Shipping
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
              )}
              {isSecondStep && (
                <Payment
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              <Box display="flex" justifyContent="space-between" gap="50px">
                {!isFirstStep && (
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    sx={{
                      backgroundColor: shades.primary[200],
                      boxShadow: "none",
                      color: "white",
                      borderRadius: 0,
                      padding: "15px 40px",
                    }}
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  fullWidth
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{
                    backgroundColor: shades.primary[400],
                    boxShadow: "none",
                    color: "white",
                    borderRadius: 0,
                    padding: "15px 40px",
                  }}
                >
                  {!isSecondStep ? "Next" : "Place Order"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Checkout;
