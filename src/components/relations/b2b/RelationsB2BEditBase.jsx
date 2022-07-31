import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Card,
  Container
} from "tabler-react"

import SiteWrapper from "../../SiteWrapper"
import ButtonBack from '../../ui/ButtonBack'
import RelationsB2BEditMenu from './RelationsB2BEditMenu'


function RelationsB2BEditBase({ t, match, history, children, cardTitle="", activeLink="" }) {
  const businessId = match.params.business_id
  const returnUrl = "/relations/b2b"

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("relations.title")}>
            <div className="page-options d-flex">
              <ButtonBack returnUrl={returnUrl} />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              <Card>
                <Card.Header>
                  <Card.Title>{cardTitle}</Card.Title>
                </Card.Header>
                {children}
              </Card>
            </Grid.Col> 
            <Grid.Col md={3}>
              <RelationsB2BEditMenu businessId={businessId} activeLink={activeLink} />
            </Grid.Col>                               
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(RelationsB2BEditBase))