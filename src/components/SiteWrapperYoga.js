import * as React from "react"
import { useContext } from 'react'
import { withTranslation } from "react-i18next"
import { NavLink, withRouter } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { ToastContainer, Slide } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { Link } from 'react-router-dom'

import { GET_SHOP_FEATURES_QUERY } from "../components/settings/shop/features/queries"
import OrganizationContext from "./context/OrganizationContext"
import CSLS from "../tools/cs_local_storage"
import CSStandalonePageLoader from "./ui/CSStandalonePageLoader"

import {
    Site,
    Nav,
    Grid,
    Button,
    RouterContextProvider,
} from "tabler-react";

import LanguageSwitcher from "../LanguageSwitcher"
const getNavBarItems = (t, loading, error, data) => {
    const shopFeatures = data.systemFeatureShop

    let items = []

    if(loading){
        items.push({
            value: t("general.loading_with_dots"),
            to: "/",
            icon: "",
            LinkComponent: withRouter(NavLink),
            useExact: true,
        })

        return items
    }

    if (error) {
        items.push({
            value: t('general.error_sad_smiley'),
            to: "/",
            icon: "",
            LinkComponent: withRouter(NavLink),
            useExact: true,
        })

        return items

    }
    items.push({
        value: t("shop.home.title"),
        to: "/yoga",
        icon: "home",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    })

    // User section Area starts here
    const refreshTokenExp = localStorage.getItem(CSLS.AUTH_REFRESH_TOKEN_EXP)
    let accountTitle = t("shop.account.title")
    let accountLink = "/shop/account"
    if (new Date() / 1000 >= refreshTokenExp || refreshTokenExp == null){
        accountTitle = t("general.sign_in")
        accountLink = "/user/login"

    }
    else {

    // MySubscription
    if (shopFeatures.subscriptions) {
        items.push({
          value: t("shop.account.subscriptions.title"),
          to: "/yoga/account/subscriptions",
          icon: "edit",
          LinkComponent: withRouter(NavLink),
          useExact: true,
        })
    }
    // Myclasspassess
    if (shopFeatures.classpasses){
        items.push({
           value: t("shop.account.classpasses.title"),
           to: "/yoga/account/classpasses",
           icon: "credit-card",
           LinkComponent: withRouter(NavLink),
           useExact: true,
        })
    }

    //Myclasses
    if (shopFeatures.classes) {
        items.push({
            value: t("shop.account.classes.title"),
            to: "/yoga/account/classes",
            icon: "book",
            LinkComponent: withRouter(NavLink),
            useExact: true,
        })
    }

    // MyEvents
    if (shopFeatures.events){
        items.push({
            value: t("shop.account.event_tickets.title"),
            to: "/yoga/account/event_tickets",
            icon: "calenders",
            LinkComponent: withRouter(NavLink),
            useExact: true,
        })
    }
   }
     
    // put account related settings
    items.push({
        value: accountTitle,
        to: accountLink,
        icon: "user",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    })    

    return items
}

function getHeaderImageUrl(organization) {
    let imageURL = "/d/static/logos/stock/logo_stock_backend.png"

    if (organization){
        if (organization.urlLogoShopHeader){
            imageURL = organization.urlLogoShopHeader
        }
    }

    return imageURL
}

const now = new Date()

function SiteWrapperYoga({t, match, history, children}) {
    const { loading, error, data } = useQuery(GET_SHOP_FEATURES_QUERY)
    const organization = useContext(OrganizationContext)

    if (loading) return <CSStandalonePageLoader/>;
    if (error) return  <p>{t('system.user.error_loading')}</p>;

    const headerImageUrl = getHeaderImageUrl(organization)

    return (
        <Site.Wrapper
          headerProps={{
            href: "/",
            alt: "Ganeshyoga",
            imageURL: headerImageUrl, // Set logo url here
            navItems: (
                <Nav.Item type="div" className="d-none d-md-flex">
                    {(data.user) ? (data.user.instructor || data.user.employee) ? <Link to="/user/welcome">
                      <Button
                        className="mr-2"
                        icon="link"
                        outline
                        size="sm"
                        color="primary"
                        >
                            {t('goto.title')}
                        </Button>
                    </Link>: "": ""}
                    <LanguageSwitcher/>
                </Nav.Item>
            ),

          }}

          navProps={{ itemsObjects: getNavBarItems(t, loading, error, data)}}
          RouterContextComponentType={withRouter(RouterContextProvider)}
          footerProps={{
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
                        <Link to="/cookie_policy">
                          {t("cookie_policy.title")}
                        </Link>
                        {}
                    </Grid.Col>
                    <Grid.Col auto={true}>
                        {}
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


export default withTranslation()(SiteWrapperYoga)
