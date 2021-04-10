import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
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
import StarBorderIcon from "@material-ui/icons/StarBorderOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: "100%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "95%",
    },
    padding: "10px",
  },
  contents: {
    marginTop: "70px",
    marginBottom: "20px"
  },
  // avatar: {
  //   margin: "auto",
  //   width: theme.spacing(70),
  //   height: theme.spacing(70),
  // },
}));

export default function ProductPage(props) {
  const [_product, setProduct] = React.useState(null);
  const [_reviews, setReviews] = React.useState([]);

  const { _product_id } = props.match.params;
  React.useEffect(() => {
    console.log("SDSD");
    axios.post(`/api/products/${_product_id}`).then((response) => {
      console.log(response.data);
      setProduct(response.data[0]);
    });

    axios.post(`/api/reviews/${_product_id}`).then((response) => {
      if (!response.data.length) {
        setReviews(response.data.length);
      } else {
        setReviews(response.data);
      }
    });
  }, []);

  const classes = useStyles();
  // let { product, generic_product, price, avg_rating, image, num_of_ratings} = _product;
  // let { review, date, upvotes, uname, rating, product, image} = _reviews;
  if (!_product) return null;
  else {
    return (
      <div className={classes.root}>
        <Grid container justify="center" className={classes.contents}>
          <Grid item xs={3}>
            <img src={_product.image} />
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <b>{_product.product}</b>
          </Grid>
          <Grid item>
            <b>Price</b>:{" "}
            {_product.price != -1 ? _product.price : "Not Available"}
          </Grid>
          <Grid item>
            {_product.num_of_ratings != -1 ? _product.num_of_ratings : "Not Available"}
            {" "} Ratings
          </Grid>
          <Grid item>
          <Grid item container
            style={{ maxHeight: window.outerHeight - 150, overflow: "auto" }}
          >
          {/* <Grid item container> */}
            <Typography>Rating: </Typography>
            {_product.avg_rating != -1 ? (
              <Rating
                readOnly
                defaultValue={parseInt(_product.avg_rating[0])}
                precision={0.1}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
            ) : (
              <Typography>No rating</Typography>
            )}
            <Typography style={{ marginLeft: "5px" }}>
                  {_product.avg_rating != -1
                    ? `${_product.avg_rating} out of 5.0`
                    : null}
                </Typography>
          </Grid>
          </Grid>
          <Grid item container spacing={2} justify="center" style={{marginTop: "20px"}}>
          <Typography>Customer Reviews</Typography>
            <Grid item>
            {_reviews.map((r) => {
              return(
                <Grid item>
                  <Paper
                    variant="outlined"
                    className={classes.itemPaper}>
                    <Grid item container direction="column" spacing={2}>
                  <Grid item>
                    {r.image}
                  </Grid>
                  <Grid item>
                    {r.review_title}
                  </Grid>
                  <Grid item>
                    {r.review}
                  </Grid>
                  <Grid item>
                    {r.date}
                  </Grid>
                  <Grid item>
                    {r.upvotes}
                  </Grid>
                  <Grid item>
                    {r.uname}
                  </Grid>
                  </Grid> 
                  </Paper>
                </Grid>
              )
            })}                    
          </Grid>
          </Grid>
          <Grid item>

          </Grid>
        </Grid>
      </div>
    );
  }
}
