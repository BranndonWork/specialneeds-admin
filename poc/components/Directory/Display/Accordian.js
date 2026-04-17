import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Utils from "@utils";
import React, { useEffect, useMemo } from "react";

// Source and Examples
// https://mui.com/material-ui/react-accordion/

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Accordian = ({ title, content, options }) => {
  const defaultOptions = useMemo(() => ({
    expandFirst: true, // expand first item initially
    expandAll: false, // expand all initially
    expandSingle: false, // expand only one at a time
  }), []);

  const [items, setItems] = React.useState([]);
  const [accordianOptions, setAccordianOptions] = React.useState({});

  useEffect(() => {
    let accordianOptions = { ...defaultOptions };
    if (options !== "undefined" && options !== null && typeof options?.constructor === Object) {
      accordianOptions = { ...defaultOptions, ...options };
    }
    setAccordianOptions({ ...accordianOptions });
    console.log("Updated accordianOptions", {
      title,
      accordianOptions,
      options,
      defaultOptions,
    });

    let somethingIsExpanded = false;
    let items = content.map((item) => {
      item.expanded = item?.expanded || false;
      if (item.expanded) {
        somethingIsExpanded = true;
      }
      return item;
    });

    if (accordianOptions?.expandAll) {
      items = items.map((item) => {
        item.expanded = true;
        return item;
      });
    }

    if (accordianOptions?.expandSingle) {
      items = items.map((item) => {
        item.expanded = false;
        return item;
      });
    }

    if (!somethingIsExpanded && accordianOptions?.expandFirst) {
      items[0].expanded = true;
    }
    console.log("accordianOptions 2", {
      title,
      accordianOptions,
      options,
      defaultOptions,
      items,
    });

    setItems(items);
  }, [content, defaultOptions, options, title]);

  if (content.length === 0) return null;

  const handleChange = (question) => (event, expandedState) => {
    let items = [];

    if (accordianOptions?.expandSingle) {
      items = content.map((item) => {
        item.expanded = false;
        return item;
      });
      items = items.map((item) => {
        if (item.question === question) {
          item.expanded = expandedState;
        }
        return item;
      });
      setItems(items);
      return;
    }

    items = content.map((item) => {
      if (item.question === question) {
        item.expanded = expandedState;
      }
      return item;
    });
    setItems(items);
  };

  return (
    <div className="listings-widget listings_generic_details accordian-widget mb-3">
      <h4 className="listings-widget-title">{title}</h4>
      <div className="listings-widget-content">
        {items.map((item) => {
          let key = Utils.contentHash(item);
          if (item?.answer?.length === 0) {
            return;
          }
          return (
            <Accordion expanded={item.expanded} onChange={handleChange(item.question)} key={key}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography>
                  {item.icon && <i className={item.icon + " according-label-icon"}></i>}
                  <strong>{item.question}</strong>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component="div">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};


export default Accordian;
