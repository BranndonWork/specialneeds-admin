"use client";

import {useTranslations} from 'next-intl';
import Alert from "@mui/lab/Alert";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import HTMLHeaderMetaData from "../_App/HTMLHeaderMetaData";

const StyledSection = styled("section")({
  marginTop: "70px",
  backgroundColor: "#f9f9f9",
});

const StyledForm = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "600px",
  margin: "0 auto",
  "& .MuiTextField-root, & .MuiFormControl-root": {
    marginBottom: "2em",
    width: "100%",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderRadius: "15px",
    },
  },
});

const StyledButton = styled(Button)({
  fontSize: "1.2em",
  padding: "1em 2em",
  borderRadius: "50px",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const ContactForm = ({
  onSuccess,
  apiPath = '/api/v1/contact',
  pageTitle,
  contentText,
  successResponse,
  fields,
  submitButtonText,
}) => {
  const t = useTranslations('common');
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});
  const [formState, setFormState] = useState(initialFormState);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const alertRef = React.createRef();

  useEffect(() => {
    const updatedFormState = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {});
    setFormState(updatedFormState);
  }, [fields]);

  const handleChange = (event, onChange) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
    if (typeof onChange === "function") onChange(event);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setError(null);
    setOpen(false);
    if (formState.botTrap) return;

    setLoading(true);
    const result = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });
    const response = await result.json();
    if (result.ok) {
      setOpen(true);
      setFormState(initialFormState);
      if (typeof onSuccess === "function") onSuccess();
    } else {
      setError(response.error || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <>
      <HTMLHeaderMetaData title={pageTitle} />
      <StyledSection>
        <div className="container ptb-100">
          <div
            className="content"
            style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}
          >
            <Typography variant="h2" component="h2" gutterBottom>
              {pageTitle}
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              <>
                <div dangerouslySetInnerHTML={{ __html: contentText }} />
                <br />
              </>
            </Typography>
            <StyledForm
              component="form"
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
              id="contact-form"
            >
              {fields.map((field) => {
                if (field.type === "textarea") {
                  return (
                    <FormControl variant="outlined" key={field.name} required={field.required}>
                      <InputLabel htmlFor={`${field.name}-field`}>{field.label}</InputLabel>
                      <OutlinedInput
                        id={`${field.name}-field`}
                        name={field.name}
                        value={formState[field.name]}
                        onChange={(event) => handleChange(event, field.onChange)}
                        multiline
                        minRows={5}
                        label={field.label}
                        inputProps={{
                          maxLength: field.maxLength || 2500,
                        }}
                      />
                    </FormControl>
                  );
                } else if (field.type === "hidden") {
                  return (
                    <TextField
                      required={field.required}
                      id={`${field.name}-field`}
                      label={field.label}
                      name={field.name}
                      value={formState[field.name]}
                      onChange={(event) => handleChange(event, field.onChange)}
                      key={field.name}
                      style={{ display: "none" }}
                    />
                  );
                } else {
                  return (
                    <TextField
                      required={field.required}
                      id={`${field.name}-field`}
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      value={formState[field.name]}
                      onChange={(event) => handleChange(event, field.onChange)}
                      key={field.name}
                      inputProps={{
                        maxLength: field.maxLength || 500,
                      }}
                    />
                  );
                }
              })}
              <TextField
                id="bot-trap"
                label="Bot Trap"
                name="botTrap"
                value={formState.botTrap || ""}
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <StyledButton variant="contained" type="submit" disabled={loading}>
                {loading ? (
                  <span>
                    <CircularProgress size={24} />{" "}
                  </span>
                ) : (
                  <>{submitButtonText || t('buttons.submit')}</>
                )}
              </StyledButton>
            </StyledForm>
            <Box ref={alertRef} style={{ height: "48px", marginTop: "8px" }}>
              {open && (
                <Alert severity="success" onClose={handleClose} style={{ fontSize: "1.1rem" }}>
                  {successResponse}
                </Alert>
              )}
              {error && (
                <Alert
                  severity="error"
                  onClose={() => {
                    setError(null);
                  }}
                  style={{ fontSize: "1.1rem" }}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </div>
        </div>
      </StyledSection>
    </>
  );
};

export default ContactForm;
