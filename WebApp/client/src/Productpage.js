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
  },
  // avatar: {
  //   margin: "auto",
  //   width: theme.spacing(70),
  //   height: theme.spacing(70),
  // },
}));

export default function ProductPage(props) {
  const [product, setProduct] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);

  const { _product_id } = props.match.params;
  React.useEffect(() => {
    console.log("SDSD");
    axios.post(`/api/products/${_product_id}`).then((response) => {
      console.log(response.data);
      setProduct(response.data[0]);
    });

    // axios.post(`/api/reviews/${_product_id}`).then((response) => {
    //   if (!response.data.length) {
    //     setReviews(response.data.length);
    //   } else {
    //     setReviews(response.data);
    //   }
    // });
  }, []);

  const classes = useStyles();
  if (!product) return null;
  else {
    return (
      <div className={classes.root}>
        <Grid container justify="center" className={classes.contents}>
          <Grid item>
            <img src={product.image} />
          </Grid>
        </Grid>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <b>{product.product}</b>
          </Grid>
          <Grid item>
            <b>Price</b>:{" "}
            {product.price != -1 ? product.price : "Not Available"}
          </Grid>
          <Grid item container>
            <Typography>Rating: </Typography>
            {product.avg_rating != -1 ? (
              <Rating
                readOnly
                defaultValue={parseInt(product.avg_rating[0])}
                precision={0.1}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
            ) : (
              <Typography>No rating</Typography>
            )}
            <Typography style={{ marginLeft: "5px" }}>
                  {product.avg_rating != -1
                    ? `${product.avg_rating} out of 5.0`
                    : null}
                </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}
