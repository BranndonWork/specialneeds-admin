import React, { memo, useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AppContext } from "../../contexts";

const defaultMessage = "Success!";
const defaultType = "success";
const defaultOptions = {
  duration: 5000,
  style: {
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
  },
  role: "status",
  ariaLive: "polite",
  interactive: true, // Pause on hover
  progress: {
    animationDuration: 3000,
    animate: true,
  },
};

// Custom component for toast content
const ToastContent = memo(({ onClick, message }) => (
  <div onClick={onClick} role="button">
    {message}
  </div>
));

ToastContent.displayName = 'ToastContent';

const showMessage = ({
  message = defaultMessage,
  type = defaultType,
  options = defaultOptions,
  onClick,
}) => {
  const toastContent = <ToastContent onClick={onClick} message={message} />;
  switch (type) {
    case "success":
      toast.success(toastContent, options);
      break;
    case "error":
      toast.error(toastContent, options);
      break;
    case "loading":
      toast.loading(toastContent, options);
      break;
    case "warning":
      toast.warning(toastContent, options);
      break;
    case "info":
      toast.info(toastContent, options);
      break;
    default:
      break;
  }
};

const ToastMessages = () => {
  const { showToast, setShowToast } = useContext(AppContext);

  useEffect(() => {
    if (showToast?.message) {
      const options = showToast.options ? { ...showToast.options } : { ...defaultOptions };
      options.id = showToast.options?.id || Math.random().toString(36).substr(2, 9);

      const closeOnClick = () => {
        toast.dismiss(options.id);
      };

      showMessage({
        ...showToast,
        options,
        onClick: showToast.options?.onClick || closeOnClick,
      });
      setShowToast(null);
    }
  }, [showToast, setShowToast]);

  return <Toaster position="bottom-center" />;
};

export { ToastMessages as default, showMessage };
