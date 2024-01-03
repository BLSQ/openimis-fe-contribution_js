import React, { useState } from "react";
import { Box, Typography, TextField, IconButton } from "@material-ui/core";
import { useGraphqlMutation, baseApiUrl } from "@openimis/fe-core";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { transactionDone, addTransactionUUid } from "../actions";
import { PROCESS_TRANSACTION } from "../graphql/queries";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid grey",
  boxShadow: 24,
  borderRadius: "10px",
  pt: 1,
  pb: 4,
};

function ConfirmPaymentModal(props) {
  const amount = props.parentProps.edited.policy.value;
  const [otp, setOtp] = useState("");
  const [conMessage, setConMessage] = useState("");
  const [err, setError] = useState(false);
  const { transactionDone, addTransactionUUid } = props;

  // for test purpose the amount below is 1 change it to edited.policy.value in production
  const mutationConfirm = PROCESS_TRANSACTION(
    amount,
    props.data.serviceProvider,
    props.data.insureeUuid,
    otp,
    props.data.transactionsUuid
  );

  const { isLoading, error, mutate } = useGraphqlMutation(mutationConfirm);
  const processTransaction = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutationConfirm })
      })

      const payload = await response.json()
      const data = payload.data.processTransaction;
      if (data?.Success === false) {
        setError(true);
        setConMessage(data.responseMessage + " Check OTP and try again");
      }
      else {
        addTransactionUUid(props.data.transactionsUuid);
        transactionDone();
        setConMessage("Transaction is Sucessfull");
        setTimeout(() => {
          props.data.handleClose();
        }, 5000);
      }

    } catch (error) {
      setConMessage("Transaction Not completed, Try again")
    }
  }

  const handleConfirmPayment = async () => {
    processTransaction()
  };
  return (
    <Box sx={style}>
      <Box display="flex" justifyContent={"end"}>
        <IconButton onClick={props.data.handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography
        id="modal-modal-title"
        variant="h6"
        align={"center"}
        component="h6"
      >
        Enter OTP to confirm Transaction
      </Typography>
      <Box
        display={"flex"}
        justifyContent={"center"}
        flexDirection="column"
        width="70%"
        margin={"0 auto"}
        marginTop="20px"
      >
        <TextField
          label="OTP"
          required
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <p style={{ color: `${err ? "red" : ""}` }}>{conMessage}</p>
      </Box>
      <Box display="flex" justifyContent="center" marginTop="20px">
        <button
          style={{
            border: "none",
            background: "#006273",
            padding: "10px",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
          }}
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </button>
      </Box>
    </Box>
  );
}

const mapDispatchToProps = {
  transactionDone,
  addTransactionUUid,
};

const mapStateToProps = (state) => ({
  transactionCompleted: state.contribution.transactionComplete,
  transactionUuid: state.contribution.transactionUuid,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmPaymentModal);
