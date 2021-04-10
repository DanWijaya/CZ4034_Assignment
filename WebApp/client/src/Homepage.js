import React from "react";
import "./App.css";
import axios from "axios";
import {
  Button,
  Grid,
  Hidden,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  Avatar,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import NavBar from "./misc/NavBar";
import { globalStyles } from "./misc/GlobalStyles";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
//Icons
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import StarBorderIcon from "@material-ui/icons/StarBorderOutlined";
// import {SentimentVeryDissatisfiedIcon, SentimentDissatisfiedIcon, SentimentSatisfiedIcon, SentimentSatisfiedAltIcon, SentimentVerySatisfiedIcon} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "100%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "95%",
    },
    padding: "10px",
  },
  appBar: {
    minHeight: "50px",
    paddingLeft: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  avatar: {
    margin: "auto",
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  reviewIcon: {
    margin: "auto",
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  searchField: {
    width: "70%",
  },
  contents: {
    marginTop: "70px",
  },
  linkText: {
    textDecoration: "none",
  },
  submitButton: {
    display: "flex",
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:focus, &:hover": {
      backgroundColor: theme.palette.success.main,
      color: "white",
    },
  },
  titleDivider: {
    backgroundColor: theme.palette.primary.main,
    marginTop: "15px",
  },
  searchFilterBox: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  itemPaper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    marginBottom: "12px",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    "&:focus, &:hover": {
      boxShadow: "0 5px 5px rgba(0,0,0,0.15), 0 5px 5px rgba(0,0,0,0.15)",
      cursor: "pointer",
    },
  },
  categoryButton: {
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  categoryButtonSelected: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
}));

function App() {
  const styles = useStyles();

  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState([]);
  const [category, setCategory] = React.useState("gender");
  const [filter, setFilter] = React.useState("gender");
  const [sortBy, setSortBy] = React.useState("gender");

  const handleSetQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleClearQuery = (e) => {
    setQuery("");
  };

  const handleCategory = (cat) => () => {
    setCategory(cat);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      query: query,
    };
    axios.post(`/api/products/${query}`).then((res) => {
      if (!res.data.length) {
        setResult(res.data.length);
      } else {
        setResult(res.data);
      }
    });
  };

  // const categoriesList = [["generic_product", "Generic Product"]]

  return (
    <div className={styles.root}>
      <form onSubmit={onSubmit}>
        <Grid container justify="center" className={styles.contents}>
          <Button
            type="submit"
            startIcon={<SearchIcon />}
            variant="contained"
            className={styles.submitButton}
            style={{ bakgroundColor: "black" }}
          >
            Search
          </Button>
          <TextField
            variant="outlined"
            value={query}
            placeholder="What to search ah?"
            className={styles.searchField}
            onChange={handleSetQuery}
            inputProps={{
              style: {
                height: "4px",
                paddingRight: "10px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ marginLeft: "-10px", marginRight: "-10px" }}
                >
                  <IconButton
                    size="small"
                    onClick={handleClearQuery}
                    style={{
                      opacity: 0.7,
                      visibility: !query ? "hidden" : "visible",
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </form>
      <Grid container spacing={2} style={{ marginTop: "5px" }} justify="center">
        <Grid item xs={9}>
          <Grid
            style={{ maxHeight: window.outerHeight - 150, overflow: "auto" }}
          >
            {!result ? (
              <Typography align="center">
                {" "}
                Our Database does not have what you need :({" "}
              </Typography>
            ) : (
              result.map((item) => {
                return (
                  <Link to={`/${item._product_id}`} className={styles.linkText}>
                    <Grid item>
                      <Paper
                        variant="outlined"
                        className={styles.itemPaper}
                      >
                        <Grid item xs={1}>
                          <Grid container justify="center">
                            {!item.image ? (
                              <RateReviewOutlinedIcon
                                className={styles.avatar}
                              />
                            ) : (
                              <Avatar
                                variant="rounded"
                                className={styles.avatar}
                                src={item.image}
                              />
                            )}
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={11}
                          style={{ marginLeft: "30px" }}
                        >
                          <Grid container direction="column" spacing={1}>
                            <Grid item>
                              <b>{item.product[0]} </b>
                            </Grid>
                            <Grid item>Category: {item.generic_product} </Grid>
                            <Grid item container>
                              {item.avg_rating != -1 ? (
                                <Rating
                                  readOnly
                                  defaultValue={parseInt(item.avg_rating[0])}
                                  precision={0.1}
                                  emptyIcon={
                                    <StarBorderIcon fontSize="inherit" />
                                  }
                                />
                              ) : (
                                <Typography>No rating</Typography>
                              )}
                              <Typography style={{ marginLeft: "5px" }}>
                                {item.avg_rating != -1
                                  ? `${item.avg_rating} out of 5.0`
                                  : null}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Link>
                );
              })
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
