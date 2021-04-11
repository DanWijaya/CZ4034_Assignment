import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
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
import WordcloudComponent from "./WordcloudComponent";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

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
    marginBottom: "20px",
  },
  // avatar: {
  //   margin: "auto",
  //   width: theme.spacing(70),
  //   height: theme.spacing(70),
  // },
}));

const StyledRating = withStyles({
  iconFilled: {
    color: '#394e2c',
  },
  iconHover: {
    color: "#394e2c"
  },
})(Rating);

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}r>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function ProductPage(props) {
  const [_product, setProduct] = React.useState(null);
  const [_reviews, setReviews] = React.useState([]);

  const { _product_id } = props.match.params;
  React.useEffect(() => {
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
          <Grid item>
            <img
              src={_product.image}
              style={{ maxHeight: "300px", maxWidth: "300px" }}
            />
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
            {_product.num_of_ratings != -1
              ? _product.num_of_ratings
              : "Not Available"}{" "}
            Ratings
          </Grid>
          <Grid item>
            <Grid
              item
              container
              style={{ maxHeight: window.outerHeight - 150, overflow: "auto" }}
            >
              {/* <Grid item container> */}
              <Typography>Average Rating: </Typography>
              {_product.avg_rating != -1 ? (
                <Rating
                  readOnly
                  defaultValue={_product.avg_rating[0]}
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
          <Grid
            item
            container
            spacing={2}
            alignItems="center"
            style={{ marginTop: "20px" }}
            direction="column"
          >
            <Grid item>
              <Typography variant="h5"><b>Customer Reviews</b></Typography>
            </Grid>
            <Grid item container alignItems="center" justify="center">
            <Typography variant="h6">Sentiment Score: </Typography>
            <StyledRating
              name="customized-icons"
              value={_product.semantic_score * 5}
              getLabelText={(value) => customIcons[value].label}
              IconContainerComponent={IconContainer}
              readOnly
            />
            <Typography style={{marginLeft: "5px"}} variant="h6">{parseFloat(_product.semantic_score*100).toFixed(2)}%</Typography>
            </Grid>
              {/* <Typography variant="h6"> </Typography> */}
            <Grid item container spacing={2} direction="column">
              <Grid item>
                <Paper variant="outlined" className={classes.itemPaper}>
                  <Grid
                    item
                    container
                    direction="column"
                    spacing={2}
                    style={{ padding: "20px" }}
                  >
                    <WordcloudComponent
                      product={_product_id}
                    />
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            {/* <Typography>Word Cloud</Typography> */}
            <Grid item container spacing={2} direction="column">
              {_reviews.map((r) => {
                return (
                  <Grid item>
                    <Paper variant="outlined" className={classes.itemPaper}>
                      <Grid
                        item
                        container
                        direction="column"
                        spacing={2}
                        style={{ padding: "20px" }}
                      >
                        <Grid item>
                          <b>User Name: </b>
                          {r.uname}
                        </Grid>
                        <Grid item>
                          <b>Review Title:</b> {r.review_title}
                        </Grid>
                        <Grid item>
                          <b>Review Description:</b> {r.review}
                        </Grid>
                        {r.image ? (
                          <Grid item>
                            <img src={r.image} />
                          </Grid>
                        ) : null}
                        <Grid item>
                          <b>Review Date:</b> {Date(r.date)}
                        </Grid>
                        <Grid item>
                          <b>Upvotes: </b>
                          {r.upvotes}
                        </Grid>
                        <Grid item>
                          <b>Vader Polarity: </b>
                          {parseFloat(r.vader_polarity*100).toFixed(2)}%
                        </Grid>
                        <Grid item>
                          <b>BiLSTM Polarity: </b>
                          {parseFloat(r.BiLSTM_polarity*100).toFixed(2)}%
                        </Grid>
                        <Grid item>
                          <b>BERT Polarity: </b>
                          {parseFloat(r.BERT_polarity*100).toFixed(2)}%
                        </Grid>
                        <Grid item>
                          <b>Average Polarity: </b>
                          {parseFloat(r.average_score*100).toFixed(2)}%
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item></Grid>
        </Grid>
      </div>
    );
  }
}
