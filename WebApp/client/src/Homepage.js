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
  Divider,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import NavBar from "./misc/NavBar";
import { globalStyles } from "./misc/GlobalStyles";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
//Icons
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import StarBorderIcon from "@material-ui/icons/StarBorderOutlined";
import timediff from "timediff";

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
    margin: "10px",
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
    margin: "10px",
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

function App(props) {
  const styles = useStyles();
  var query;
  // const [query, setQuery] = React.useState(props.match.params.query_string);
  const [reviews, setReview] = React.useState(null);
  // const [products, setProduct] = React.useState([]);
  const [products, setProduct] = React.useState(new Map());
  const [category, setCategory] = React.useState("gender");
  const [filter, setFilter] = React.useState("gender");
  const [sortBy, setSortBy] = React.useState("gender");
  const [queryTime, setQueryTime] = React.useState(null);
  const handleSetQuery = (e) => {
    query = e.target.value;
  };

  const handleClearQuery = (e) => {
    query = "";
  };

  const handleCategory = (cat) => () => {
    setCategory(cat);
  };
  const history = useHistory();
  function getDifferenceInSeconds(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    console.log(date1, date2)
    return diffInMs / 1000;
  }

  const onSubmit = (e) => {
    var starttime = new Date()
    e.preventDefault();
    if (query) {
      axios.post(`/api/reviews/${query}`).then((res) => {
        setReview(res.data);
        history.push({
          pathname: `/search/${query}`,
          state: {
            reviews: res.data,
            query_string: query,
          },
        });
        var endtime = new Date()
        setQueryTime(getDifferenceInSeconds(starttime, endtime))
      })
    }
  };

  React.useEffect(() => {
    axios.post(`/api/products/*`).then((res) => {
      if (!res.data.length) {
        setProduct(new Map());
      } else {
        let data = new Map();
        console.log(res.data);
        res.data.forEach((r) => data.set(r._product_id[0], r));
        setProduct(data);
      }
    });
  },[])
  
  React.useEffect(() => {
    if (props.match.params.query_string && props.location.state) {
      setReview(props.location.state.reviews);
    }
  }, [props.match.params.query_string]);

  function groupBy(collection, property) {
    var i = 0,
      val,
      index,
      values = [],
      result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1) result[index].push(collection[i]);
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }

  function ReviewList(props) {
    const { reviews, products } = props;
    const styles = useStyles();

    return reviews.map((item, idx) => {
      let product_id = item.product_id[0];
      // console.log(product_id);
      return (
        <Link to={`/${item.product_id}`} className={styles.linkText}>
          <Grid item>
            <Paper variant="outlined" className={styles.itemPaper}>
              <Grid item xs={2}>
                <Grid container justify="center">
                  <Grid item>
                    {!products.get(product_id) ? (
                      <RateReviewOutlinedIcon className={styles.avatar} />
                    ) : (
                      <img
                        src={products.get(product_id).image}
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container xs={10} style={{ marginLeft: "30px" }}>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <b>{item.product[0]} </b>
                  </Grid>
                  <Grid item>Product Category: {item.generic_product[0]}</Grid>
                  <Grid item>
                    Number of ratings:{" "}
                    {products.get(product_id)
                      ? products.get(product_id).num_of_ratings
                      : 0}
                  </Grid>
                  <Divider />
                  <Grid item style={{ marginTop: "10px" }}>
                    <b>Review Title: </b>
                    {item.review_title[0]}
                  </Grid>
                  <Grid item>
                    <b>Review Description:</b>{" "}
                    {item.review[0].split(" ").slice(0, 20).join(" ")} ...
                  </Grid>
                  <Grid item container>
                    {item.rating[0] != -1 ? (
                      <Rating
                        readOnly
                        defaultValue={parseFloat(item.rating[0])}
                        precision={0.1}
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      />
                    ) : (
                      <Typography>No rating</Typography>
                    )}
                    <Typography style={{ marginLeft: "5px" }}>
                      {item.rating[0] != -1
                        ? `${item.rating[0]} out of 5.0`
                        : null}
                    </Typography>
                  </Grid>
                  <Grid item>{item.upvotes[0]} people find it useful</Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Link>
      );
    });
  }
  return (
    <div className={styles.root}>
      <form onSubmit={onSubmit} action={`/${query}`}>
        <Grid container justify="center" className={styles.contents}>
          <TextField
            id="searchField"
            variant="outlined"
            value={query}
            // defaultValue={props.match.params.query_string}
            onChange={handleSetQuery}
            placeholder="What to search ah?"
            className={styles.searchField}
            onSubmit={onSubmit}
            inputProps={{
              style: {
                height: "4px",
                paddingRight: "10px",
              },
            }}
            InputProps={
              {
                // endAdornment: (
                //   <InputAdornment
                //     position="end"
                //     style={{ marginLeft: "-10px", marginRight: "-10px" }}
                //   >
                //     <IconButton
                //       size="small"
                //       onClick={handleClearQuery}
                //       style={{
                //         opacity: 0.7,
                //         visibility: query || query === "" ? "hidden" : "visible",
                //       }}
                //     >
                //       <ClearIcon />
                //     </IconButton>
                //   </InputAdornment>
                // ),
              }
            }
          />
          <Button
            type="submit"
            startIcon={<SearchIcon />}
            variant="contained"
            className={styles.submitButton}
            style={{ bakgroundColor: "black" }}
          >
            Search
          </Button>
        </Grid>
      </form>
      <Grid container spacing={2} justify="center">
        <Grid item xs={9}>
          <Grid item container justify="space-between" style={{marginBottom: "10px", marginTop: "10px"}}>
          {props.location.state ? (
            <Typography variant="h6">Search results for: {props.location.state.query_string}</Typography>
          ) : null}
          <Typography variant="h6">{queryTime ? `Query time: ${queryTime} seconds` : null}</Typography>
          </Grid>
          <Grid
            style={{ maxHeight: window.outerHeight - 150, overflow: "auto" }}
          >
            {reviews == null ? null : reviews.length == 0 ? (
              <Typography align="center">
                {" "}
                Our Database does not have what you need :({" "}
              </Typography>
            ) : (
              <div>
                
              <ReviewList reviews={reviews} products={products} />
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
