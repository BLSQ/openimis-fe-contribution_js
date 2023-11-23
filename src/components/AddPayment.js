import React, { useState, useEffect } from "react";
import { useGraphqlQuery, useGraphqlMutation } from "@openimis/fe-core";
import { AmountInput } from "@openimis/fe-core";
import {
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
} from "@material-ui/core";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import { connect } from "react-redux";
import { setPaymentTypeIsMobile, resetPaymentTypeIsMobile } from "../actions";
import { GET_WALLETS, INITIATE_TRANSACTION } from "../graphql/queries";

function AddPayment(props) {
  const parentProps = props.parentProps;
  const { edited } = parentProps;
  const [serviceProvider, setServiceProvider] = useState("");
  const [open, setOpen] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  const [transactionsUuid, setTransactionUuid] = useState("");
  const [message, setMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const { setPaymentTypeIsMobile, resetPaymentTypeIsMobile } = props;

  useEffect(() => {
    setPaymentTypeIsMobile();

    return () => {
      resetPaymentTypeIsMobile();
    };
  }, []);

  //get insuree uuid from edited in props
  const insureeUuid = edited?.policy?.family?.headInsuree?.uuid;
  // graphql to fetch wallets
  const { data } = useGraphqlQuery(GET_WALLETS);
  //graphql mutation to iniate transaction
  //for test purpose the value of the amount is 1 below change it to edited.policy.value in production
  const mutationIniate = INITIATE_TRANSACTION(
    edited.policy.value,
    serviceProvider,
    insureeUuid
  );
  const { isloading, error, mutate } = useGraphqlMutation(mutationIniate);
  const handleClose = () => {
    setOpen(false);
  };

  const submitPayment = (e) => {
    e.preventDefault();
    // run the mutation function
    if (!serviceProvider) {
      setMessage("You have to provide a Service Provider");
    } else {
      setMessage("");
      mutate()
        .then((result) => {
          const response = result.payload.data.initiateTransaction;
          if (response?.Success === false) {
            setErrMessage(response.responseMessage);
            setOpenErr(true);
          } else {
            setTransactionUuid(response?.uuids);
            setOpen(true);
          }
        })
        .catch((err) => {
          setErrMessage("Payment iniatiation failed try again");
          setOpenErr(true);
        });
    }
  };

  return (
    <div
      style={{
        padding: "1em",
      }}
    >
      <div
        style={{
          border: "solid 1px grey",
          borderRadius: "10px",
          padding: "1em",
        }}
      >
        <Typography variant={"h6"} component={"h4"}>
          Add Payment
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Payment Service Provider
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={serviceProvider}
                label="Payment Service Provider"
                onChange={(e) => setServiceProvider(e.target.value)}
              >
                {data?.paymentServiceProvider?.edges.map((node) => (
                  <MenuItem value={node.node.uuid} key={node.node.uuid}>
                    {node.node.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <p style={{ color: "red" }}> {message}</p>
          </Grid>
          <Grid item xs={3}>
            <AmountInput
              label="Amount"
              required
              value={edited.policy?.value}
              readOnly={true}
            />
          </Grid>
        </Grid>
        <Box display={"flex"} justifyContent={"end"}>
          <button
            style={{
              background: "#006273",
              padding: "10px",
              border: "solid 1px grey",
              cursor: "pointer",
              borderRadius: "10px",
              color: "white",
              boxShadow: "box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
            onClick={submitPayment}
          >
            Initiate Payment
          </button>
        </Box>
      </div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ConfirmPaymentModal
          parentProps={parentProps}
          data={{ insureeUuid, serviceProvider, handleClose, transactionsUuid }}
          submitPayment={submitPayment}
        />
      </Modal>

      <Modal
        open={openErr}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              background: "white",
              border: "1px solid grey",
              boxShadow: 24,
              borderRadius: "10px",
              padding: "10px",
              pt: 1,
              pb: 4,
            }}
          >
            <p
              style={{
                color: "red",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {errMessage}
            </p>

            <div style={{ display: "flex", justifyContent: "end" }}>
              <button
                onClick={() => setOpenErr(false)}
                style={{ position: "relative", right: "0" }}
              >
                close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const mapDispatchToProps = {
  setPaymentTypeIsMobile,
  resetPaymentTypeIsMobile,
};

const mapStateToProps = (state) => ({
  paymentTypeIsMobile: state.contribution.paymentTypeIsMobile,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPayment);
