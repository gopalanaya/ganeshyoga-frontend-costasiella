import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from "uuid"
import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"

import {
  Badge,
  Card,
  Dimmer,
  Grid,
  Table
} from "tabler-react"
import { GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY } from '../../../relations/accounts/schedule_event_tickets/queries'

import YogaAccountProfileBase from '../YogaAccountProfileBase'
import ContentCard from '../../../general/ContentCard'

function YogaAccountEventTickets({t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY, {
    skip: loadingUser || errorUser ||!dataUser,
    variables: {
      account: dataUser && dataUser.user ? dataUser.user.accountId : null
    },
    fetchPolicy: "network-only"
  })

  if (loading || loadingUser || !data) return (
    <YogaAccountProfileBase>
      <Dimmer active={true} loader={true} />
    </YogaAccountProfileBase>
  )

  if (error || errorUser) return (
    <YogaAccountProfileBase>
      {t("shop.account.event_tickets.error_loading_data")}
    </YogaAccountProfileBase>
  )

  const user = dataUser.user
  const eventTickets = data.accountScheduleEventTickets

  // Empty list
  if (!eventTickets.edges.length) {
    return (
      <YogaAccountProfileBase accountName={user.fullName}>
        <Grid.Row>
          <Grid.Col md={12}>
            <Card cardTitle={t('shop.account.event_tickets.title')} >
              <Card.Body>
                {t('shop.account.event_tickets.empty_list')}
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </YogaAccountProfileBase>
    )
  }

  // Populated list
  return (
    <YogaAccountProfileBase accountName={user.fullName} >
      <Grid.Row>
        <Grid.Col md={12}>
          <ContentCard cardTitle={t('shop.account.event_tickets.title')}
            hasCardBody={false}
            pageInfo={eventTickets.pageInfo}
            onLoadMore={() => {
              fetchMore({
                variables: {
                  after: eventTickets.pageInfo.endCursor
                },
                updateQuery: (previousResult, {fetchMoreResult}) => {
                  const newEdges = fetchMoreResult.accountScheduleEventTickets.edges
                  const pageInfo = fetchMoreResult.accountScheduleEventTickets.pageInfo

                  return newEdges.length
                    ? {
                      // Put the new tickets at the end of the list and update `pageInfo`
                      // so we have the new `endCursor` and `hasNextPage` values
                      eventTickets: {
                        __typename: previousResult.accountScheduleEventTickets.__typename,
                        edges: [ ...previousResult.accountScheduleEventTickets.edges, ...newEdges ],
                        pageInfo
                      }
                    }
                    : previousResult
                }
              })
            }}>
              <Table cards>
                <Table.Header>
                  <Table.Row key={v4()}>
                    <Table.ColHeader>{t('general.ticket')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.start')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.location')}</Table.ColHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {eventTickets.edges.map(({ node }) => (
                    <Table.Row key={v4()}>
                      <Table.Col>
                        {node.scheduleEventTickets.scheduleEvent.name} <br />
                        <Badge>{node.scheduleEventTicket.name}</Badge> {" "}
                        {(node.cancelled) ? <Badge color="warning">{t("general.cancelled")}</Badge>: ""}
                      </Table.Col>
                      <Table.Col>
                        {moment(node.scheduleEventTicket.scheduleEvent.dateStart).format(dateFormat)}
                      </Table.Col>
                      <Table.Col>
                        {node.scheduleEventTicket.scheduleEvent.organizationLocation.name}
                      </Table.Col>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </ContentCard>
        </Grid.Col>
      </Grid.Row>
    </YogaAccountProfileBase>
  )
}

export default withTranslation()(withRouter(YogaAccountEventTickets))