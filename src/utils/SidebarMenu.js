import * as React from 'react';
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from "@mui/icons-material/Logout";
import { FaqIcon, FaqIconBlack } from './Icons';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
export const SidebarMenuTitleIcons = [
  {
    title: "Dashboard",
    icons: (
      <DashboardIcon />
    ),
  },
  {
    title: "Service Providers",
    icons: (
      <GroupIcon />
    ),
  },
  {
    title: "Service Categories",
    icons: (
      <SettingsSuggestIcon />
    ),
  },
  {
    title: "Bookings",
    icons: (
      <ViewInArIcon />
    ),
  },

  // {
  //   title: "FAQ",
  //   icons:
  //     <>
  //     {/* icon/image with non-hovered class */}
  //       <img
  //         src="assets/images/faq_icon_black.png"
  //         alt="eye2"
  //         className="table_action_icons nonHovered"
  //       />
  //     {/* icon/image with hovered class */}
  //       <img
  //         src="assets/images/faq_icon_white.png"
  //         alt="eye2"
  //         className="table_action_icons hovered"
  //       />
  //     </>,
  // },
  // {
  //   title: "Feedback",
  //   icons: <StarIcon />
  // },
  // {
  //   title: "Event Management",
  //   icons: (
  //     <>
  //     {/* icon/image with non-hovered class */}
  //       <img
  //         src="assets/images/event_icon_black.png"
  //         alt="eye2"
  //         className="table_action_icons nonHovered"
  //       />
  //     {/* icon/image with hovered class */}
  //       <img
  //         src="assets/images/event_icon_white.png"
  //         alt="eye2"
  //         className="table_action_icons hovered"
  //       />
  //     </>
  //   ),
  // },
  {
    title: "Logout",
    icons: <LogoutIcon />,
  },

];

// Super admin menus

export const SidebarRestaurantMenuTitleIcons = [
  {
    title: "All Orders",
    icons: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24.734"
        height="17.313"
        viewBox="0 0 24.734 17.313"
      >
        <path
          id="orders"
          d="M16.449,10.905a1.873,1.873,0,0,1-1.6-.9L12.365,5.881,9.884,10a1.88,1.88,0,0,1-1.6.908,1.777,1.777,0,0,1-.514-.073L2.472,9.321V16.2a1.233,1.233,0,0,0,.935,1.2l8.355,2.091a2.512,2.512,0,0,0,1.2,0L21.322,17.4a1.239,1.239,0,0,0,.935-1.2V9.321l-5.294,1.511A1.777,1.777,0,0,1,16.449,10.905Zm8.216-4.336L22.675,2.6a.631.631,0,0,0-.645-.344L12.365,3.485l3.544,5.878a.635.635,0,0,0,.715.282l7.648-2.183a.636.636,0,0,0,.394-.893ZM2.055,2.6.064,6.569a.63.63,0,0,0,.39.889L8.1,9.641a.635.635,0,0,0,.715-.282l3.548-5.874L2.7,2.253A.631.631,0,0,0,2.055,2.6Z"
          transform="translate(0.003 -2.247)"
        />
      </svg>
    ),
  },
  {
    title: "Menu",
    icons: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24.734"
        height="17.313"
        viewBox="0 0 24.734 17.313"
      >
        <path
          id="orders"
          d="M16.449,10.905a1.873,1.873,0,0,1-1.6-.9L12.365,5.881,9.884,10a1.88,1.88,0,0,1-1.6.908,1.777,1.777,0,0,1-.514-.073L2.472,9.321V16.2a1.233,1.233,0,0,0,.935,1.2l8.355,2.091a2.512,2.512,0,0,0,1.2,0L21.322,17.4a1.239,1.239,0,0,0,.935-1.2V9.321l-5.294,1.511A1.777,1.777,0,0,1,16.449,10.905Zm8.216-4.336L22.675,2.6a.631.631,0,0,0-.645-.344L12.365,3.485l3.544,5.878a.635.635,0,0,0,.715.282l7.648-2.183a.636.636,0,0,0,.394-.893ZM2.055,2.6.064,6.569a.63.63,0,0,0,.39.889L8.1,9.641a.635.635,0,0,0,.715-.282l3.548-5.874L2.7,2.253A.631.631,0,0,0,2.055,2.6Z"
          transform="translate(0.003 -2.247)"
        />
      </svg>
    ),
  },
  {
    title: "Promo code",
    icons: <LocalGroceryStoreIcon />,
  },
  {
    title: "Profile",
    icons: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17.242"
        height="17.242"
        viewBox="0 0 17.242 17.242"
      >
        <path
          id="profile"
          d="M8.621,9.7A4.849,4.849,0,1,0,3.772,4.849,4.851,4.851,0,0,0,8.621,9.7Zm4.311,1.078H11.076a5.862,5.862,0,0,1-4.91,0H4.311A4.31,4.31,0,0,0,0,15.087v.539a1.617,1.617,0,0,0,1.616,1.616H15.626a1.617,1.617,0,0,0,1.616-1.616v-.539A4.31,4.31,0,0,0,12.932,10.776Z"
        />
      </svg>
    ),
  },
  {
    title: "Logout",
    icons: (
      <svg
        id="logout"
        xmlns="http://www.w3.org/2000/svg"
        width="21.68"
        height="21.68"
        viewBox="0 0 21.68 21.68"
      >
        <path
          id="Path_31720"
          data-name="Path 31720"
          d="M9.936,13.55a2.71,2.71,0,1,1,0-5.42h4.517V2.484A2.486,2.486,0,0,0,11.969,0H2.484A2.486,2.486,0,0,0,0,2.484V19.2a2.486,2.486,0,0,0,2.484,2.484h9.485A2.486,2.486,0,0,0,14.453,19.2V13.55Z"
        />
        <path
          id="Path_31721"
          data-name="Path 31721"
          d="M17.784,15.964a.9.9,0,0,1-.557-.835V12.42H10.9a.9.9,0,0,1,0-1.807h6.323V7.9a.9.9,0,0,1,1.542-.639l3.613,3.613a.9.9,0,0,1,0,1.277l-3.613,3.613A.9.9,0,0,1,17.784,15.964Z"
          transform="translate(-0.967 -0.677)"
        />
      </svg>
    ),
  },
];
