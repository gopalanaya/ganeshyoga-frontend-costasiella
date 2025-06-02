import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter }  from 'react-router'
import { v4 } from "uuid"
import moment from "moment"
import {
    Badge,
    Card,
    Dimmer,
    Grid,
    Icon
} from "tabler-react"

import AppSettingsContext from '../../../../context/AppSettingsContext'
import GET_USER_PROFILE from '../../../../../queries/system/get_user_profile'
import LoadMoreOnBottomScroll from '../../../../general/LoadMoreOnBottomScroll'

import { QUERY_ACCOUNT_SUBSCRIPTION_CREDITS } from './queries'
import YogaAccountSubscriptionCreditsBase from "./YogaAccountSubscriptionCreditsBase"


function YogaAccountSubscriptionCredits({t, match, history }){
    const appSettings = useContext(AppSettingsContext)
    const dateFormat = appSettings.dateFormat
    const timeFormat = appSettings.timeFormatMoment 

    // Chain queries. First query user data and then query invoices for that user once we have the account Id.
    const subscriptionId = match.params.subscription_id
    const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
    const { loading, error, data, fetchMore } = useQuery(QUERY_ACCOUNT_SUBSCRIPTION_CREDITS, {
        skip: loadingUser || errorUser || !dataUser,
        variables: {
            accountSubscription: subscriptionId
        },
        fetchPolicy: "network-only"
    })

    if (loading || loadingUser || !data) return (
      <YogaAccountSubscriptionCreditsBase>
        <Dimmer active={true}  loader={true} />
      </YogaAccountSubscriptionCreditsBase>
    )
  
    if (error || errorUser) return (
      <YogaAccountSubscriptionCreditsBase>
        {t("shop.account.subscriptions.error_loading_data")}
      </YogaAccountSubscriptionCreditsBase>
    )  

    const user = dataUser.user
    const subscriptionCredits = data.accountSubscriptionCredits
    const organizationSubscription = data.accountSubscription.organizationSubscription

    // Unlimited credits, no need to go into details
    if (organizationSubscription.unlimited) {
        return (
          <YogaAccountSubscriptionCreditsBase accountName={user.fullName}>
            <Grid.Row>
                <Grid.Col md={12}>
                    <Card cardTitle={t('shop.account.subscriptions.credits.title')} >
                        <Card.Body>
                            <Card.Alert color="primary"><Icon name="check" /> {t('shop.accunt.subscriptions.credits.unlimited')}</Card.Alert>
                        </Card.Body>
                    </Card>
                </Grid.Col>
            </Grid.Row>
          </YogaAccountSubscriptionCreditsBase>
        )
    }

    // Empty list
    if (!subscriptionCredits.edges.length) {
      return (
        <YogaAccountSubscriptionCreditsBase accountName={user.fullName}>
          <Grid.Row>
            <Grid.Col md={12}>
              <Card cardTitle={t('shop.account.subscriptions.credits.title')}>
                <Card.Body>
                  {t('shop.account.subscriptions.credits.empty_list')}
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </YogaAccountSubscriptionCreditsBase>
      )
    }

    // Populated List
    return (
      <YogaAccountSubscriptionCreditsBase accountName={user.fullName}>
        <Grid.Row>
          <Grid.Col md={12}>
            <h4>{t('shop.account.subscriptions.credits.title')}</h4>
            <LoadMoreOnBottomScroll
             // headerContent={headerOptions}
             pageInfo={subscriptionCredits.pageInfo}
             onLoadMore={() => {
               fetchMore({
                variables: {
                  after: subscriptionCredits.pageInfo.endCursor
                },
                updateQuery: (previousResult, {fetchMoreResult }) => {
                  const newEdges = fetchMoreResult.accountSubscriptionCredits.edges
                  const pageInfo = fetchMoreResult.accountSubscriptionCredits.pageInfo

                  return newEdges.length 
                  ? {
                    // Put thhe new subscription credits at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage`  values
                    accountSubscriptionCredits: {
                      __typename: previousResult.accountSubscriptionCredits.__typename,
                      edges: [ ...previousResult.accountSubscriptionCredits.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                  : previousResult
                }
               })
             }}
             >
              {/* <Grid.Row> */}
              { subscriptionCredits.edges.map(({ node }) => (
                <Card key={v4()} statusColor={(!node.scheduleItemAttendance) ? "success": "default"}>
                  <Card.Body>
                    <Grid.Row>
                      <Grid.Col xs={12} md={4}>
                        <div className='mb-xs-3'>
                          <small className='text-muted'>
                            {t("shop.account.subscriptions.credits.added_on")}
                          </small>
                          <h6>
                            { moment(node.createdAt).format(dateFormat)}
                            <div><small className='text-muted'>{node.description}</small></div>
                            { /* Perhaps a badge here to indicate active /inactive in the future? */}
                            { (node.reconciled) && <div> 
                              <small className='text-muted'>
                                {t("shop.account.subscriptions.credits.reconciled_on")} { moment(node.reconciled).format(dateFormat)}

                              </small>
                              </div>}
                          </h6>
                        </div>
                      </Grid.Col>
                      <Grid.Col xs={12} md={4}>
                        <div className='mb-xs-3'>
                          <small className="text-muted">
                            {t("shop.account.subscriptions.credits.expiration")}
                          </small>
                          <h6>
                            {moment(node.expiration).format(dateFormat)}
                          </h6>
                        </div>
                      </Grid.Col>
                      <Grid.Col xs={12} md={4}>
                        <div className='mb-xs-3'>
                          <small className='text-muted'>
                            {t("shop.account.subscriptions.credits.status")}
                          </small>
                          {(!node.scheduleItemAttendance) ?
                          // No attendance recorded yet, show available or expired
                          (moment() > moment(node.expiration)) ?
                          <h6><Badge color="danger">{t("shop.account.subscriptions.credits.expired")}</Badge></h6>:
                          <h6><Badge color="success">{t("shop.account.subscriptions.credits.available")}</Badge></h6>
                          :
                          <h6><Badge color="default">{t("shop.account.subscriptions.credit.used")}</Badge></h6>  
                        }
                         {(node.scheduleItemAttendance) && <small className='text-muted'>
                          <div>
                            {`${moment(node.scheduleItemAttendance.date).format(dateFormat)}
                             ${moment(node.scheduleItemAttendance.date + " " + node.scheduleItemAttendance.scheduleItem.timeStart).format(timeFormat)}
                             - ${node.scheduleItemAttendance.scheduleItem.organizationClasstype.name}`}
                          </div>
                          {node.scheduleItemAttendance.scheduleItem.organizationLocationRoom.organizationLocation.name}
                          </small>}
                        </div>
                      </Grid.Col>
                    </Grid.Row>
                  </Card.Body>
                </Card>
              ))}
             </LoadMoreOnBottomScroll>
          </Grid.Col>
        </Grid.Row>
      </YogaAccountSubscriptionCreditsBase>
    )
}

export default withTranslation()(withRouter(YogaAccountSubscriptionCredits))