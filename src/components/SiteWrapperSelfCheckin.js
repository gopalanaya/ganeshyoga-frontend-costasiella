import * as React from "react"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'

import CSStandalonePageLoader from "./ui/CSStandalonePageLoader"
import GET_USER from "../queries/system/get_user"

import {
  Site,
  Grid,
  RouterContextProvider,
} from "tabler-react";


// import type { NotificationProps } from "tabler-react";

// type Props = {|
//   +children: React.Node,
// |};

// type State = {|
//   notificationsObjects: Array<NotificationProps>,
// |};

// type subNavItem = {|
//   +value: string,
//   +to?: string,
//   +icon?: string,
//   +LinkComponent?: React.ElementType,
// |};

// type navItem = {|
//   +value: string,
//   +to?: string,
//   +icon?: string,
//   +active?: boolean,
//   +LinkComponent?: React.ElementType,
//   +subItems?: Array<subNavItem>,
//   +useExact?: boolean,
// |};

const now = new Date()

function SiteWrapperSelfCheckin({t, match, history, children}) {
  const { error, loading, data } = useQuery(GET_USER)

  if (loading) return <CSStandalonePageLoader />
  if (error) return <p>{t('system.user.error_loading')}</p>; 

  console.log(data)

  return (
    <Site.Wrapper
      headerProps={{
        href: "/",
        alt: "Costasiella",
        imageURL: "/d/static/logos/stock/logo_stock_backend.png", // Set logo url here
        // navItems: (
        //   <Nav.Item type="div" className="d-none d-md-flex">
        //     <Link to="/settings/general">
        //       <Button
        //         icon="settings"
        //         outline
        //         size="sm"
        //         color="primary"
        //       >
        //         {this.props.t('general.settings')}
        //       </Button>
        //     </Link>
        //   </Nav.Item>
        // ),
        // notificationsTray: {
        //   notificationsObjects,
        //   markAllAsRead: () =>
        //     this.setState(
        //       () => ({
        //         notificationsObjects: this.state.notificationsObjects.map(
        //           v => ({ ...v, unread: false })
        //         ),
        //       }),
        //       () =>
        //         setTimeout(
        //           () =>
        //             this.setState({
        //               notificationsObjects: this.state.notificationsObjects.map(
        //                 v => ({ ...v, unread: true })
        //               ),
        //             }),
        //           5000
        //         )
        //     ),
        //   unread: unreadCount,
        // },
        accountDropdown: {
        avatarURL: "#",
        name: data.user.firstName + ' ' + data.user.lastName,
        description: "",
        options: [
          // { icon: "user", value: "Profile" },
          { icon: "lock", value: "Change password", to: "/#/user/password/change/" },
          { isDivider: true },
          { icon: "log-out", value: "Sign out", to: "/#/user/logout/" },
        ],
      },
      }}
      // navProps={{ itemsObjects: navBarItems }}
      // navProps={{ itemsObjects: getNavBarItems(this.props.t, data.user) }}
      routerContextComponentType={withRouter(RouterContextProvider)}
      footerProps={{
        // links: [
        //   <a href="#">First Link</a>,
        //   <a href="#">Second Link</a>,
        //   <a href="#">Third Link</a>,
        //   <a href="#">Fourth Link</a>,
        //   <a href="#">Five Link</a>,
        //   <a href="#">Sixth Link</a>,
        //   <a href="#">Seventh Link</a>,
        //   <a href="#">Eigth Link</a>,
        // ],
        // note:
        //   "Premium and Open Source dashboard template with responsive and high quality UI. For Free!",
        copyright: (
          <React.Fragment>
            <small>
              Peacefully powered by
              <a
                href="https://costasiella.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Costasiella
              </a>{". "}
              All rights reserved © {now.getFullYear()}.
            </small>
          </React.Fragment>
        ),
        nav: (
          <React.Fragment>
            <Grid.Col auto={true}>
              {/* <List className="list-inline list-inline-dots mb-0">
                <List.Item className="list-inline-item">
                  <a href="./docs/index.html">Documentation</a>
                </List.Item>
                <List.Item className="list-inline-item">
                  <a href="./faq.html">FAQ</a>
                </List.Item>
              </List> */}
            </Grid.Col>
            <Grid.Col auto={true}>
              {/* <Button
                href="https://github.com/tabler/tabler-react"
                size="sm"
                outline
                color="primary"
                RootComponent="a"
              >
                Source code
              </Button> */}
            </Grid.Col>
          </React.Fragment>
        ),
      }}
    >
      {children}
      <ToastContainer 
        autoClose={5000} 
        transition={Slide}
      />
    </Site.Wrapper> 
  )
}


// class SiteWrapperSelfCheckin extends React.Component<Props, State> {
//   state = {}  

//   render(): React.Node {
//     return (
//       <Query query={GET_USER} >
//         {({ loading, error, data }) => {
//           if (loading) return <p>{this.props.t('general.loading_with_dots')}</p>;
//           if (error) return <p>{this.props.t('system.user.error_loading')}</p>; 
          
//           console.log('user data in site wrapper')
//           console.log(data)
      
//           return <Site.Wrapper
//             headerProps={{
//                 href: "/",
//                 alt: "Costasiella",
//                 imageURL: "/d/static/logos/stock/logo_stock_backend.png", // Set logo url here
//                 // navItems: (
//                 //   <Nav.Item type="div" className="d-none d-md-flex">
//                 //     <Link to="/settings/general">
//                 //       <Button
//                 //         icon="settings"
//                 //         outline
//                 //         size="sm"
//                 //         color="primary"
//                 //       >
//                 //         {this.props.t('general.settings')}
//                 //       </Button>
//                 //     </Link>
//                 //   </Nav.Item>
//                 // ),
//                 // notificationsTray: {
//                 //   notificationsObjects,
//                 //   markAllAsRead: () =>
//                 //     this.setState(
//                 //       () => ({
//                 //         notificationsObjects: this.state.notificationsObjects.map(
//                 //           v => ({ ...v, unread: false })
//                 //         ),
//                 //       }),
//                 //       () =>
//                 //         setTimeout(
//                 //           () =>
//                 //             this.setState({
//                 //               notificationsObjects: this.state.notificationsObjects.map(
//                 //                 v => ({ ...v, unread: true })
//                 //               ),
//                 //             }),
//                 //           5000
//                 //         )
//                 //     ),
//                 //   unread: unreadCount,
//                 // },
//                 accountDropdown: {
//                 avatarURL: "#",
//                 name: data.user.firstName + ' ' + data.user.lastName,
//                 description: "",
//                 options: [
//                   // { icon: "user", value: "Profile" },
//                   { icon: "lock", value: "Change password", to: "/#/user/password/change/" },
//                   { isDivider: true },
//                   { icon: "log-out", value: "Sign out", to: "/#/user/logout/" },
//                 ],
//               },
//               }}
//               // navProps={{ itemsObjects: navBarItems }}
//               // navProps={{ itemsObjects: getNavBarItems(this.props.t, data.user) }}
//               routerContextComponentType={withRouter(RouterContextProvider)}
//               footerProps={{
//                 // links: [
//                 //   <a href="#">First Link</a>,
//                 //   <a href="#">Second Link</a>,
//                 //   <a href="#">Third Link</a>,
//                 //   <a href="#">Fourth Link</a>,
//                 //   <a href="#">Five Link</a>,
//                 //   <a href="#">Sixth Link</a>,
//                 //   <a href="#">Seventh Link</a>,
//                 //   <a href="#">Eigth Link</a>,
//                 // ],
//                 // note:
//                 //   "Premium and Open Source dashboard template with responsive and high quality UI. For Free!",
//                 copyright: (
//                   <React.Fragment>
//                     Copyleft © {now.getFullYear()}.
//                     <a
//                       href="https://www.costasiella.com"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {" "}
//                       Edwin van de Ven
//                     </a>{". "}
//                     All rights reserved.
//                   </React.Fragment>
//                 ),
//                 nav: (
//                   <React.Fragment>
//                     <Grid.Col auto={true}>
//                       {/* <List className="list-inline list-inline-dots mb-0">
//                         <List.Item className="list-inline-item">
//                           <a href="./docs/index.html">Documentation</a>
//                         </List.Item>
//                         <List.Item className="list-inline-item">
//                           <a href="./faq.html">FAQ</a>
//                         </List.Item>
//                       </List> */}
//                     </Grid.Col>
//                     <Grid.Col auto={true}>
//                       {/* <Button
//                         href="https://github.com/tabler/tabler-react"
//                         size="sm"
//                         outline
//                         color="primary"
//                         RootComponent="a"
//                       >
//                         Source code
//                       </Button> */}
//                     </Grid.Col>
//                   </React.Fragment>
//                 ),
//               }}
//             >
//               {this.props.children}
//               <ToastContainer 
//                 autoClose={5000} 
//                 transition={Slide}
//               />
//             </Site.Wrapper>
//           }}
//         </Query>
//     );
//   }
// }

export default withTranslation()(SiteWrapperSelfCheckin)
