const catchErrors = (error, displayError, clearAfter = 0) => {
  let errorMsg;
  if (error.response && error.response.data) {
    if (error.response.data.email) {
      errorMsg = error.response.data.email[0];
    } else {
      errorMsg = error.response.data;

      // for image upload
      if (error.response.data.error) {
        errorMsg = error.response.data.error.message;
      }
    }
  } else if (error.request) {
    // Request made but no response recieved
    errorMsg = error.request;
    // console.error("Error request", errorMsg);
  } else {
    console.error("Error message", errorMsg, error);
  }

  displayError(errorMsg);
  if (clearAfter > 0) {
    window.setTimeout(() => {
      displayError("");
    }, clearAfter);
  }
  return errorMsg;
};

export default catchErrors;
