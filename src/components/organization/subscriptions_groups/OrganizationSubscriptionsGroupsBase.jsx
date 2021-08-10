// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'


import {
  Page,
  Grid,
  Icon,
  Button,
  Container,
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"

import OrganizationMenu from "../OrganizationMenu"


function OrganizationSubscriptionsGroupsBase({ t, history, children, showBack=false }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")}>
            <div className="page-options d-flex">
              <Link to="/organization/subscriptions" 
                    className='btn btn-outline-secondary btn-sm'>
                  <Icon prefix="fe" name="arrow-left" /> {t('general.back_to')} {t('organization.subscriptions.title')}
              </Link>
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              {(showBack) ? 
                <Link to="/organization/subscriptions/groups">
                  <Button color="primary btn-block mb-6">
                    <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
                  </Button>
                </Link>
                :
                <HasPermissionWrapper permission="add"
                                      resource="organizationsubscriptiongroup">
                  <Link to="/organization/subscriptions/groups/add">
                    <Button color="primary btn-block mb-6">
                      <Icon prefix="fe" name="plus-circle" /> {t('organization.subscription_groups.add')}
                    </Button>
                  </Link>
                </HasPermissionWrapper>
              }
              <OrganizationMenu activeLink=''/>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(OrganizationSubscriptionsGroupsBase))