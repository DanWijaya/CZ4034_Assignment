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

function App() {
  const styles = useStyles();
  var query;
  // const [query, setQuery] = React.useState("");
  const [reviews, setReview] = React.useState([]);
  // const [products, setProduct] = React.useState([]);
  const [products, setProduct] = React.useState(new Map());
  const [category, setCategory] = React.useState("gender");
  const [filter, setFilter] = React.useState("gender");
  const [sortBy, setSortBy] = React.useState("gender");

  const handleSetQuery = (e) => {
    query = e.target.value;
  };

  const incrementCounts = (e, idx) => {
    console.log(idx);
    console.log(e);
    var reivew_id = document
      .getElementById(`grid-${idx}`)
      .getAttribute("review_id");

    var body = {
      id: reivew_id,
      click_counts: { inc: 1 },
    };

    // console.log(body);
    axios.post(`/api/reviews/update`, body).then((res) => {
      console.log(res);
    });
  };

  const handleClearQuery = (e) => {
    query = "";
  };

  const handleCategory = (cat) => () => {
    setCategory(cat);
  };

  React.useEffect(() => {
    axios.post(`/api/products/*`).then((res) => {
      if (!res.data.length) {
        setProduct(new Map());
      } else {
        let data = new Map();
        res.data.forEach((r) => data.set(r._product_id[0], r));
        setProduct(data);
      }
    });
  }, []);

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

  const onSubmit = (e) => {
    e.preventDefault();
    // const data = {
    //   query: query,
    // };
    axios.post(`/api/reviews/${query}`).then((res) => {
      if (!res.data.length) {
        setReview(res.data.length);
      } else {
        setReview(res.data);
      }
    });
  };

  function ReviewList(props) {
    const { reviews, products } = props;
    const styles = useStyles();

    return reviews.map((item, idx) => {
      let product_id = item.product_id[0];
      return (
        <Link to={`/${item.product_id}`} className={styles.linkText}>
          <Grid
            id={`grid-${idx}`}
            item
            onClick={(e) => incrementCounts(e, idx)}
            review_id={item.id}
          >
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
      <form onSubmit={onSubmit}>
        <Grid container justify="center" className={styles.contents}>
          <TextField
            variant="outlined"
            value={query}
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
      <Grid container spacing={2} style={{ marginTop: "5px" }} justify="center">
        <Grid item xs={9}>
          <Grid
            style={{ maxHeight: window.outerHeight - 150, overflow: "auto" }}
          >
            {!reviews ? (
              <Typography align="center">
                {" "}
                Our Database does not have what you need :({" "}
              </Typography>
            ) : (
              <ReviewList reviews={reviews} products={products} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
