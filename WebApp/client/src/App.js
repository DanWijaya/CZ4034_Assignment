import React from "react";
import "./App.css";
import axios from "axios";
import {
  AppBar,
  Button,
  Grid,
  Hidden,
  Link,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  Avatar
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from '@material-ui/icons/Search';
import NavBar from "./misc/NavBar";
import { globalStyles } from "./misc/GlobalStyles";
import { makeStyles } from "@material-ui/core/styles";
import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';

const useStyles = makeStyles((theme) => ({
  root:{
    margin: "auto",
    maxWidth: "100%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "95%"
    },
    padding: "10px"
  },
  appBar:{
    minHeight: "50px",
    paddingLeft: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  avatar:{
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
    width: "60%",
  },
  contents: {
    marginTop: "70px",
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
  subjectPaper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    marginBottom: "12px"
  },
  searchFilterBox: {
    backgroundColor: theme.palette.primary.main,
    color: "white"
  },
  categoryButton: {
    backgroundColor: "white",
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    }
  },
  categoryButtonSelected: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    }
  }
}));

function App() {
  const styles = useStyles();

  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState([]);
  const [category, setCategory] = React.useState("gender");
  const [filter , setFilter] = React.useState("gender");
  const [sortBy, setSortBy] = React.useState("gender");

  const handleSetQuery = (e) => {
    setQuery(e.target.value)
  };

  const handleClearQuery = (e) => {
    setQuery("");
  };

  const handleCategory = (cat) => () => {
    setCategory(cat)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      query : query,
      category: category
    }
    axios.post(`/api/query/`, data).then((res) => {
      if(!res.data.length){
        setResult(res.data.length)
      }else{
        setResult(res.data)
      }
    })
  }

  const categoriesList = [["generic_product", "Generic Product"]]

  return (
    <div className={styles.root}>
      <NavBar />
      <form onSubmit={onSubmit}>
      <Grid container justify="center" className={styles.contents}>
        <Button type="submit" startIcon={<SearchIcon/>} variant="contained" className={styles.submitButton} style={{bakgroundColor: "black"}}>
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
              paddingRight: "10px"
            }
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
      <Grid container spacing={2} style={{marginTop: "5px"}}>
        {/* <Grid item container> */}
        <Hidden mdUp>
        <Grid item xs={9} >
            <Grid style={{maxHeight: (window.outerHeight - 150), overflow: 'auto'}}>
            {!result ? <Typography align="center"> Our Database does not have what you need :( </Typography> 
              :
            result.map((item) => (
              <Grid item>
              <Paper variant="outlined" className={styles.subjectPaper}>
                
                  <Grid item xs={2}>
                    <Grid container justify="center">
                    {!item.image ? 
                      <RateReviewOutlinedIcon className={styles.avatar}/>
                    :
                  <a href={item.image} target="_blank">
                    <Avatar variant="rounded" className={styles.avatar} src={item.image}/>
                  </a> 
                  }
                  </Grid>
                  </Grid>
                  <Grid item container xs={10} style={{marginLeft: "20px"}}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>Product Name: {item.product} </Grid>
                        <Grid item>Category: {item.generic_product} </Grid>
                        <Grid item>Review Title : {item.review_title}  </Grid>
                      </Grid>
                    </Grid>
              </Paper>
            </Grid>
            )
            )}
            </Grid>
          </Grid>
        <Grid item xs={3}>
          <Grid item container direction="column" alignItems="center" spacing={2}>
              <Grid item>
                <b>Category</b>
              </Grid>
              <Grid item container direction="column">
                {categoriesList.map((cat) => (
                    <Button variant="outlined" onClick={() => setCategory(cat[0])} className={category == cat[0]? styles.categoryButtonSelected :styles.categoryButton }>
                      {cat[1]}
                  </Button>
                ))}
              </Grid>
          </Grid>
          <Grid item container direction="column" alignItems="center" spacing={2}> 
              <Grid item>
                <b>Sort by </b>
              </Grid>
              <Grid item container direction="column">
                {categoriesList.map((cat) => (
                    <Button variant="outlined" onClick={() => setSortBy(cat[0])} className={sortBy == cat[0]? styles.categoryButtonSelected :styles.categoryButton }>
                      {cat[1]}
                    {/* <Link href="#" onClick={handleCategory(cat[0])}>{cat[1]}</Link> */}
                  </Button>
                ))}
              </Grid>
          <Grid item style={{marginTop: "20px"}}>
                <b>Filter</b>
              </Grid>
              <Grid item container direction="column">
                {categoriesList.map((cat) => (
                    <Button variant="outlined" onClick={() => setFilter(cat[0])} className={filter == cat[0]? styles.categoryButtonSelected :styles.categoryButton }>
                      {cat[1]}
                    {/* <Link href="#" onClick={handleCategory(cat[0])}>{cat[1]}</Link> */}
                  </Button>
                ))}
              </Grid>
          </Grid>
          </Grid>
        {/* </Grid> */}
        </Hidden>
        <Hidden smDown>
        <Grid item xs={2}>
          <Grid item container direction="column" alignItems="center" spacing={2}>
              <Grid item>
                <b>Category </b>
              </Grid>
              <Grid item container direction="column">
                {categoriesList.map((cat) => (
                    <Button variant="outlined" onClick={() => setCategory(cat[0])} className={category == cat[0]? styles.categoryButtonSelected :styles.categoryButton }>
                      {cat[1]}
                  </Button>
                ))}
              </Grid>
          </Grid>
          </Grid>
          <Grid item xs={8} >
            <Grid style={{maxHeight: (window.outerHeight - 150), overflow: 'auto'}}>
            {!result ? <Typography align="center"> Our Database does not have what you need :( </Typography> 
              :
            result.map((item) => (
              <Grid item>
                <Paper variant="outlined" className={styles.subjectPaper}>
                  
                    <Grid item xs={1}>
                      <Grid container justify="center">
                      {!item.image ? 
                        <RateReviewOutlinedIcon className={styles.avatar}/>
                      :
                      <Avatar variant="rounded" className={styles.avatar} src={item.image}/>
                    }
                    </Grid>
                    </Grid>
                    <Grid item container xs={11} style={{marginLeft: "30px"}}>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>Product Name: {item.product} </Grid>
                          <Grid item>Category: {item.generic_product} </Grid>
                          <Grid item>Review Title : {item.review_title}  </Grid>
                        </Grid>
                      </Grid>
                </Paper>
              </Grid>
            )
            )}
            </Grid>
          </Grid>
          <Grid item xs={2}>
          <Grid item container direction="column" alignItems="center" spacing={2}> 
              <Grid item>
                <b>Sort by </b>
              </Grid>
              <Grid item container direction="column">
                {categoriesList.map((cat) => (
                    <Button variant="outlined" onClick={() => setSortBy(cat[0])} className={sortBy == cat[0]? styles.categoryButtonSelected :styles.categoryButton }>
                      {cat[1]}
                  </Button>
                ))}
              </Grid>
          <Grid item style={{marginTop: "20px"}}>
                <b>Filter</b>
              </Grid>
              <Grid item container direction="column">
                {categoriesList.map((cat) => (
                    <Button variant="outlined" onClick={() => setFilter(cat[0])} className={filter == cat[0]? styles.categoryButtonSelected :styles.categoryButton }>
                      {cat[1]}
                  </Button>
                ))}
              </Grid>
          </Grid>
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default App;
