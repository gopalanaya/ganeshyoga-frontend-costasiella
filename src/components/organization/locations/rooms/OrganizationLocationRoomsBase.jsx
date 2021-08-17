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
import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"

import OrganizationMenu from "../../OrganizationMenu"


function OrganizationLocationRoomsBase({t, history, match, children}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")}>
            <div className="page-options d-flex">
              <Link to="/organization/locations" 
                    className='btn btn-outline-secondary btn-sm'>
                  <Icon prefix="fe" name="arrow-left" /> {t('general.back_to')} {t('organization.locations.title')}
              </Link>
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
            <HasPermissionWrapper permission="add"
                                  resource="organizationlocationroom">
              <Button color="primary btn-block mb-6"
                      onClick={() => history.push("/organization/locations/rooms/add/" + match.params.location_id)}>
                <Icon prefix="fe" name="plus-circle" /> {t('organization.location_rooms.add')}
              </Button>
            </HasPermissionWrapper>
            <OrganizationMenu activeLink='locations'/>
          </Grid.Col>
        </Grid.Row>
      </Container>
    </div>
  </SiteWrapper>        
)}


export default withTranslation()(withRouter(OrganizationLocationRoomsBase))