import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import "./Sidebar.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Redirect, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { logoutAction } from "../../../../../services/actions/auth.action";
import { Button } from "react-bootstrap";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: 0,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Sidebar() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { admin } = useSelector((state) => state.auth);
  let location = useLocation();

  const [active, setActive] = React.useState("/");

  const handleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setActive(location.pathname.substring(1));
    // console.log(location.pathname.substring(1))
  }, [active, location]);

  let sideBarMenus = [

    {
      title: "Topics",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/topics"
    },
    {
      title: "Create Test +",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/add_test"
    },
    {
      title: "Main Topics",
      icons: (<></>
        // <DashboardIcon />
      ),
      to: "/in/maintopics",
      url: "in/maintopics"
    },

    {
      title: "Chapters",
      icons: (<></>
        // <DashboardIcon />
      ),
      to: "/in/chapters",
      url: "in/chapters"
    },


    {
      title: "Dashboard",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/dashboard"
    },
    {
      title: "Subjects",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/subjects"
    },
    {
      title: "Classes",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/classes"
    },
    {
      title: "Total Tests",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/total_tests"
    },
    {
      title: "Wallet",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/wallet"
    },
    {
      title: "Logout",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/logout"
    },
  ];

  return (
    <div>

      <CssBaseline />

      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            className={clsx(classes.menuButton,)}
          >
            <MenuIcon />
          </IconButton>

          <div className="appBar_items">
            <Button color="inherit"><Link to="/">Contact Us</Link></Button>
            <Button color="inherit"><Link to="/">Home</Link></Button>
            {/* <img src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=486" /> */}
            <Button color="inherit">
              {admin.data.first_name}
            </Button>
          </div>

        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <div className="sidebar_logo">
            <img src="/assets/images/logo.png" />
            <h6>CeletomUniverse</h6>
          </div>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton> */}
        </div>

        <List className="sidebar_items_list_internal_teacher">
          {sideBarMenus &&
            sideBarMenus.map((menu, index) => (
              <>
                <Link
                  key={index}
                  className={menu.url === active ? "active" : menu.title === "Logout" ? "loginBtnSidebar" : ""}
                  onClick={() => menu.title === "Logout" ? dispatch(logoutAction()) : null}
                  to={
                    (menu.to ? menu.to :
                      menu.title === "Create Test +" ?
                        "/in/add_test"
                        : menu.title === "Dashboard"
                          ? "/in/dashboard"
                          : menu.title === "Topics"
                            ? "/in/topics"
                            : "#")
                  }
                >
                  {
                    menu.title == "Subjects" ? <>
                      <button type="button" class="modelBtn" data-bs-toggle="modal" data-bs-target="#subjectsModel">
                        Subjects
                      </button>
                    </> :
                      menu.title == "Classes" ? <>
                        <button type="button" class="modelBtn" data-bs-toggle="modal" data-bs-target="#classesModel">
                          Classes
                        </button>
                      </> :
                        menu.title == "Total Tests" ? <>
                          <button type="button" class="modelBtn" data-bs-toggle="modal" data-bs-target="#testDetails">
                            Total Tests
                          </button>
                        </> : menu.title == "Wallet" ? <>
                          <button type="button" class="modelBtn" data-bs-toggle="modal" data-bs-target="#walletModal">
                            Wallet
                          </button>
                        </> :
                          <ListItem button>
                            {/* <ListItemIcon className="sidebar_icons">
                    {menu.icons}
                  </ListItemIcon> */}

                            <ListItemText primary={menu.title} className="sidebar_text" />
                          </ListItem>}
                </Link>
              </>
            ))}
        </List>
        <Divider />
      </Drawer>

      <SubjectsAlert />
      <ClassesAlert />
      <TestDetails />
      <WalletModal />
    </div >
  );
}


const ClassesAlert = () => {
  const { classesList } = useSelector((state) => state.main);
  const { admin } = useSelector((state) => state.auth);

  return (
    <>
      <div class="modal fade hide " id="classesModel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <div className="logo_row">
                <img src={"/assets/images/logo.png"} className="logoImg" />
                <h1>CelatomUniverse</h1>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className="left">
                {
                  classesList.map(item => <button>{item.class_name}</button>)
                }
              </div>
              <div className="right">
                <img src={require("./boy_on_books.png")} />
                <img src={require("./circle.png")} className="circleImg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

const SubjectsAlert = () => {
  const { subjects_list } = useSelector((state) => state.main);
  const { admin } = useSelector((state) => state.auth);

  return (
    <>
      <div class="modal fade hide " id="subjectsModel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <div className="logo_row">
                <img src={"/assets/images/logo.png"} className="logoImg" />
                <h1>CelatomUniverse</h1>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className="left">
                {
                  subjects_list.map(item => <button>{item.subject}</button>)
                }
              </div>
              <div className="right">
                <img src={require("./boy_on_books.png")} />
                <img src={require("./circle.png")} className="circleImg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

const TestDetails = () => {
  const { total_test_list } = useSelector((state) => state.main);
  const { admin } = useSelector((state) => state.auth);

  return (
    <>
      <div class="modal fade hide" id="testDetails" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1>Hey {admin.data.first_name}!</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className="left">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Sr.</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Total Test</th>
                      <th scope="col">Test Accessed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      total_test_list.map((item, index) => {
                        return (
                          <tr>
                            <th scope="row">{index < 10 ? "0" + index : index}</th>
                            <td>{item.subject}</td>
                            <td>{item.totalTest}</td>
                            <td>{item.totalAccessed}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>

              </div>
              <div className="right">
                <img src={require("./total_test.png")} />
                <img src={require("./circle.png")} className="circleImg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


const WalletModal = () => {
  const { walletData } = useSelector((state) => state.main);
  const { admin } = useSelector((state) => state.auth);

  return (
    <>
      <div class="modal fade hide" id="walletModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1>{admin.data.first_name}'s Wallet!
                <img src={require("./wallet_icon.png")} className="small-image m-2" />
              </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className="left">
                <table class="table">
                  <tbody>
                    <tr>
                      <th scope="col">Total Score.</th>
                      <td>{walletData.score}</td>
                    </tr>
                    <tr>
                      <th scope="col">Total Points.</th>
                      <td>{walletData.points}</td>
                    </tr>
                  </tbody>
                </table>

                <button className="btn btn-white">Withdraw</button>

              </div>
              <div className="right">
                <div className="imgs">
                  <img src={require("./wallet_1.png")} />
                  <img src={require("./wallet_2.png")} />
                </div>
                <img src={require("./circle.png")} className="circleImg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Sidebar;
