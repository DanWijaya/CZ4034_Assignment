import React from "react";
import "./App.css";
import axios from "axios";
import {
  AppBar,
  Button,
  Grid,
  Link,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Paper
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from '@material-ui/icons/Search';
import NavBar from "./misc/NavBar";
import { globalStyles } from "./misc/GlobalStyles";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";

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
  searchField: {
    width: "60%",
  },
  contents: {
    // display: "flex",
    // justifyContent: "center",
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
}));

function App() {
  const styles = useStyles();

  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState([]);
  const [category, setCategory] = React.useState("gender");

  const handleSetQuery = (e) => {
    setQuery(e.target.value);
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

  const categoriesList = [["first_name", "First Name"], ["gender", "Gender"]]
  // let zoom = (( window.outerWidth - 10 ) / window.innerWidth);
  return (
    <div className={styles.root}>
      <ThemeProvider theme={globalStyles}>
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
      {/* <Divider variant="middle" className={styles.titleDivider} /> */}
      <Grid container direction="column" spacing={2} style={{marginTop: "5px"}}>
        <Grid item container>
          <Grid item xs={2}>
            <Grid item container direction="column" alignItems="center" spacing={2}> 
              <Grid item>
                <b>Category </b>
              </Grid>
              {categoriesList.map((cat) => (
                  <Grid item>
                  <Link href="#" onClick={handleCategory(cat[0])}>{cat[1]}</Link>
                </Grid>
          ))}
          </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid style={{maxHeight: (window.outerHeight - 150), overflow: 'auto'}}>
            {!result ? <Typography align="center"> Our Database does not have what you need :( </Typography> 
              :
            result.map((item) => (
              <Grid item>
              <Paper variant="outlined" className={styles.subjectPaper}>
                <Grid container direction="column">
                  <Grid item>First Name: {item.first_name} </Grid>
                  <Grid item>Last Name: {item.last_name} </Grid>
                  <Grid item>Email : {item.email}  </Grid>
                  <Grid item>First Name: {item.first_name} </Grid>
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
              {categoriesList.map((cat) => (
                  <Grid item>
                  <Link href="#" onClick={handleCategory(cat[0])}>{cat[1]}</Link>
                </Grid>
          ))}
          <Grid item style={{marginTop: "20px"}}>
                <b>Filter</b>
              </Grid>
              {categoriesList.map((cat) => (
                  <Grid item>
                  <Link href="#" onClick={handleCategory(cat[0])}>{cat[1]}</Link>
                </Grid>
          ))}
          </Grid>
          </Grid>
        </Grid>
      </Grid>
      </ThemeProvider>
    </div>
  );
}

export default App;
