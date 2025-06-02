import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import GET_USER_PROFILE from "../../../queries/system/get_user_profile"


import OrganizationContext from '../../context/OrganizationContext'

import {
  Button,
  Card,
  Dimmer,
  Grid,
  Icon
} from "tabler-react"
import HasPermissionWrapper from "../../HasPermissionWrapper"

import CSStandalonePageWide from "../../ui/CSStandalonePageWide"


function Welcome({t, match, history}) {
  const organization = useContext(OrganizationContext)
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <CSStandalonePageWide urlLogo={organization.urlLogoLogin}>
      <Dimmer active={true} loader={true} />
    </CSStandalonePageWide>
  )
  if (error) return (
    <CSStandalonePageWide urlLogo={organization.urlLogoLogin}>
      {t("shop.account.class_info.error_loading_data")}
    </CSStandalonePageWide>
  )

  const user = data.user

  // Push the user to the shop in case they're not an employee or instructor
  if (!user.employee && !user.instructor) {
    history.push("/shop/account")
  } 


  return (
    <CSStandalonePageWide urlLogo={organization.urlLogoLogin}>
      <div className="text-center mb-5">
        <h2>{t("general.welcome")} {user.firstName}</h2>
        <h5>{t("user.welcome.where_next_question")}</h5>
      </div>
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={3} offsetMd={3}>
          <Card>
            <Card.Body>
              <h5>{t("user.welcome.myaccount_explanation")}</h5>
              {t("shop.account.title")} <br /><br />
              <Link to="/yoga">
                <Button 
                  block
                  outline
                  color="primary"
                >
                  {t("user.welcome.myaccount_to")} <Icon name="chevron-right" />
                </Button>
              </Link>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h5>{t("shop.title")}</h5>
              {t("user.welcome.shop_explanation")} <br /><br />
              <Link to="/">
                <Button 
                  block
                  outline
                  color="primary"
                >
                  {t("user.welcome.shop_to")} <Icon name="chevron-right" />
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={3}>
          <Card>
            <Card.Body>
              <h5>{t("general.backend")}</h5>
              {t("user.welcome.backend_explantion")} <br /><br />
              <Link to="/backend">
                <Button 
                  block
                  outline
                  color="primary"
                >
                  {t("user.welcome.backend_to")} <Icon name="chevron-right" />
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Grid.Col>
        <HasPermissionWrapper resource="selfcheckin" permission="view" hideLoading={true}>
          <Grid.Col xs={12} sm={12} md={3} offsetMd={3}>
            <Card>
              <Card.Body>
                <h5>{t("selfcheckin.home.title")}</h5>
                {t("user.welcome.selfcheckin_explantion")} <br /><br />
                <Link to="/selfcheckin">
                  <Button 
                    block
                    outline
                    color="primary"
                  >
                    {t("user.welcome.selfcheckin_to")} <Icon name="chevron-right" />
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Grid.Col>
        </HasPermissionWrapper>
      </Grid.Row>
    </CSStandalonePageWide>
  )
}

export default withTranslation()(withRouter(Welcome))