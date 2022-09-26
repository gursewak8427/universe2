import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Collapse, ListItemButton } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
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
    width: `calc(100% - ${0}px)`,
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
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
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

function CustomExpandableMenuItem({ menu, active }) {
  const [isExpand, setExpand] = React.useState(false);

  useEffect(() => {
    menu.items.map(item => {
      if (item.title == active) {
        setExpand(true)
      }
    })
  }, [active])

  return (
    <>
      <a>
        <ListItem
          button
          onClick={() => setExpand(!isExpand)}
          className={isExpand ? "active" : null}
        >
          {/* <ListItemIcon className="sidebar_icons">
            {menu.icons}
          </ListItemIcon> */}
          <ListItemText primary={menu.title} className="sidebar_text" />
          {isExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </a>
      {menu.items.map((item, index) => (
        <>
          <Collapse in={isExpand} timeout="auto" unmountOnExit>
            <List component="div" className="subItemMenu">
              <Link
                key={index}
                to={item.to}
              >
                <ListItem button sx={{ pl: 6 }}
                  className={item.title == active ? "sub_menu_btn_active" : null}>
                  <ListItemText primary={item.title} />
                </ListItem>
              </Link>
            </List>
          </Collapse>
        </>
      ))}
    </>
  )

}

function Sidebar({ isSidebarShow }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { admin } = useSelector((state) => state.auth);

  let location = useLocation();

  const [active, setActive] = React.useState("/");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setActive(location.pathname.substring(1));
    console.log(location.pathname.substring(1))
  }, [active, location]);

  let sideBarMenus = [
    {
      title: "Start Test +",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "student/start"
    },
    {
      title: "Dashboard",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "student/dashboard"
    },
    {
      title: "Old Test Results",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "student/dashboard"
    },
    {
      title: "Progress Calculator",
      url: "in/chapters",
      items: [
        {
          title: "Subject Performance",
          to: "/a"
        },
        {
          title: "Test Performance",
          to: "/a"
        },
      ]
    },

    {
      title: "About Us",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/dashboard"
    },
    {
      title: "Feedback/Issues",
      icons: (<></>
        // <DashboardIcon />
      ),
      url: "in/subjects"
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
          <h3 style={{ width: "100%" }}>Welcome to CelatomUniverse</h3>
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton,)}
          >
            <MenuIcon />
          </IconButton> */}

          <div className="appBar_items">
            <Button color="inherit">Contact Us</Button>
            <Button color="inherit">
              <Link to="/">Home</Link>
            </Button>
            <img src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=486" />
            <Button color="inherit">
              {admin.data.first_name}
            </Button>
          </div>

        </Toolbar>
      </AppBar>

      {
        !isSidebarShow && isSidebarShow == false ?
          <>Nothing</> :
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
              {/* <div className="sidebar_logo">
              <h6>CeletomUniverse</h6>
            </div> */}
              {/* <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton> */}
            </div>

            <List className="sidebar_items_list_student">
              {sideBarMenus &&
                sideBarMenus.map((menu, index) => (
                  <>
                    {
                      menu.items ?
                        <CustomExpandableMenuItem menu={menu} active={active} /> :
                        <>
                          <Link
                            key={index}
                            className={menu.url === active ? "active" : menu.title === "Logout" ? "loginBtnSidebar" : ""}
                            onClick={() => menu.title === "Logout" ? dispatch(logoutAction()) : null}
                            to={
                              (menu.to ? menu.to :
                                menu.title === "Start Test +" ?
                                  "/student/start"
                                  : menu.title === "Dashboard"
                                    ? "/student/dashboard"
                                    : menu.title === "Old Test Results"
                                      ? "/student/old_test_results"
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
                                      <ListItemText primary={menu.title} className="sidebar_text" />
                                    </ListItem>}
                          </Link>
                        </>
                    }
                  </>
                ))}
            </List>
            <img className="student_sidebar_books_image" src={require("./sidebar_books.png")} width="200px" />
            <Divider />
          </Drawer>
      }


      <SubjectsAlert />
      <ClassesAlert />
      <TestDetails />
      <WalletModal />
    </div >
  );
}


const ClassesAlert = () => {
  const { classesList } = useSelector((state) => state.main);

  return (
    <>
      <div class="modal fade hide " id="classesModel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <div className="logo_row">
                <img src={require("./Icon.svg")} className="logoImg" />
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

  return (
    <>
      <div class="modal fade hide " id="subjectsModel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <div className="logo_row">
                <img src={require("./Icon.svg")} className="logoImg" />
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

  return (
    <>
      <div class="modal fade hide" id="testDetails" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1>Hey Kamal!</h1>
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

  return (
    <>
      <div class="modal fade hide" id="walletModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1>Kamal's Wallet!
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
