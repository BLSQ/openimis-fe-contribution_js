import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
});

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import { FormattedMessage } from "@openimis/fe-core";

const SaveContributionDialog = ({
  classes,
  contribution,
  onCancel,
  onConfirm,
}) => {
  if (!contribution.policy || !contribution.policy.value) return null;
  const [step, setStep] = useState(1);
  const policyValue = parseInt(contribution.policy.value, 10);
  return (
    <Dialog open={!!contribution} onClose={onCancel}>
      <DialogTitle>
        <FormattedMessage
          module="contribution"
          id="saveContributionDialog.title"
        />
      </DialogTitle>
      <DialogActions>
        {policyValue && (
          <Button
            onClick={(e) => onConfirm()}
            className={classes.primaryButton}
            autoFocus
          >
            <FormattedMessage
              module="contribution"
              id="saveContributionDialog.ok.button"
            />
          </Button>
        )}

        {step === 1 && (
          <Button onClick={onCancel} className={classes.secondaryButton}>
            <FormattedMessage module="core" id="cancel" />
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default injectIntl(
  withTheme(withStyles(styles)(SaveContributionDialog))
);
