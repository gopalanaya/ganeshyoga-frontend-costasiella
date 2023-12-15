import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Alert,
  Badge,
  Button,
  Card,
  Dimmer,
  Dropdown,
  Icon,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import { toast } from 'react-toastify'
import { get_attendance_list_query_variables } from "./tools"

import CSLS from '../../../../../tools/cs_local_storage'
import ContentCard from "../../../../general/ContentCard"
import BadgeBookingStatus from "../../../../ui/BadgeBookingStatus"
import ButtonConfirm from '../../../../ui/ButtonConfirm'
import ScheduleClassAttendanceSearch from "./ScheduleClassAttendanceSearch"
import ScheduleClassAttendanceBase from "./ScheduleClassAttendanceBase"
import ScheduleClassAttendanceDelete from "./ScheduleClassAttendanceDelete"
import { 
  GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, 
  UPDATE_SCHEDULE_ITEM_ATTENDANCE,
  RESEND_INFO_MAIL_SCHEDULE_ITEM_ATTENDANCE 
} from "./queries"


// function sleepFor(sleepDuration){
//   var now = new Date().getTime();
//   while(new Date().getTime() < now + sleepDuration){ /* Do nothing */ }
// }

function setAttendanceStatus({t, match, updateAttendance, node, status, setAttendanceRefetching=f=>f}) {
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date

  setAttendanceRefetching(true)

  updateAttendance({
    variables: { 
      input: {
        id: node.id, 
        bookingStatus: status
      }
    },
    refetchQueries: [
      {query: GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, 
        variables: get_attendance_list_query_variables(schedule_item_id, class_date)}
    ], 
    // Mutation is "complete" when refetchQueries finish
    awaitRefetchQueries: true
  }).then(({ data }) => {
    console.log('got data', data);
    // sleepFor(1000)
    setAttendanceRefetching(false)
    toast.success(
      t('schedule.classes.class.attendance.status_saved'), {
        position: toast.POSITION.BOTTOM_RIGHT
      })
  }).catch((error) => {
    setAttendanceRefetching(false)
    toast.error((t('general.toast_server_error')) +  error, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    console.log('there was an error sending the query', error);
  })
}


function ScheduleClassAttendance({ t, match, location }) {
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date
  const [attendanceRefetching, setAttendanceRefetching] = useState(false)
  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, {
      variables: get_attendance_list_query_variables(schedule_item_id, class_date),
      fetchPolicy: "network-only"
    }
  )
  const [ updateAttendance ] = useMutation(UPDATE_SCHEDULE_ITEM_ATTENDANCE)
  const [ resendInfoMail ] = useMutation(RESEND_INFO_MAIL_SCHEDULE_ITEM_ATTENDANCE)

  // Inform account profile how to come back here using the back button
  // From attendance list to customer profile
  localStorage.setItem(CSLS.RELATIONS_ACCOUNT_PROFILE_RETURN, location.pathname)

  // Inform attendance registration components to come back here
  // From customer profile to attendance list
  localStorage.setItem(CSLS.SCHEDULE_CLASSES_BOOK_RETURN, location.pathname)

  // Loading
  if (loading) return <ScheduleClassAttendanceBase>
      <ContentCard cardTitle={t('general.attendance')}>
        <Dimmer loader={true} active={true} />
      </ContentCard>
  </ScheduleClassAttendanceBase>
  // Error
  if (error) {
    console.log(error)
    return <ScheduleClassAttendanceBase>{t('general.error_sad_smiley')}</ScheduleClassAttendanceBase>
  }
  
  const scheduleClass = data.scheduleClass
  console.log(scheduleClass)
  let checkedInIds = []
  data.scheduleItemAttendances.edges.map(({ node }) => (
    checkedInIds.push(node.account.id)
  ))

  const headerOptions = <Card.Options>
    <div className='float-right'>
      <Badge color="success">{scheduleClass.countAttending} {t("schedule.classes.class.attendance.attending")}</Badge> {" "}
      <Badge color="primary">{scheduleClass.countBooked} {t("schedule.classes.class.attendance.booked")}</Badge> {" "}
      {/* <Badge color="info">{t("general.spaces")}: {scheduleClass.spaces}</Badge>  */}
    </div>
  </Card.Options>


  return (
    <ScheduleClassAttendanceBase refetch={refetch}>
      {(scheduleClass.status === 'CANCELLED') ? 
        <Alert type="warning">
          <strong>{t("schedule.classes.class.attendance.this_class_is_cancelled")}</strong> - {" "}
          {t("schedule.classes.class.attendance.unable_to_add_attendance")}
        </Alert>  
        : 
        <ScheduleClassAttendanceSearch 
          checkedInIds={checkedInIds}
        />
      }
      <ContentCard 
        cardTitle={t('general.attendance')}
        pageInfo={data.scheduleItemAttendances.pageInfo}
        headerContent={headerOptions}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
          variables: {
            after: data.scheduleItemAttendances.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.scheduleItemAttendances.edges
            const pageInfo = fetchMoreResult.scheduleItemAttendances.pageInfo 

            return newEdges.length
              ? {
                  // Put the new scheduleItemAttendances at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  data: {
                    scheduleItemAttendances: {
                      __typename: previousResult.scheduleItemAttendances.__typename,
                      edges: [ ...previousResult.scheduleItemAttendances.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                }
              : previousResult
            }
          })
        }}>
        { !(data.scheduleItemAttendances.edges.length) ? 
          <Card.Body>
            <p>{t('schedule.classes.class.attendance.empty_list')}</p>
          </Card.Body>
          :
          <Dimmer active={attendanceRefetching} loader={true}>
            <Table cards>
              <Table.Header>
                <Table.Row key={v4()}>
                  <Table.ColHeader>{t('general.name')}</Table.ColHeader>
                  <Table.ColHeader>{t('general.booking_status')}</Table.ColHeader>
                  <Table.ColHeader></Table.ColHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.scheduleItemAttendances.edges.map(({ node }) => (
                    <Table.Row key={v4()}>
                      <Table.Col>
                        <Link to={`/relations/accounts/${node.account.id}/profile`}>
                          {node.account.fullName}
                        </Link>
                      </Table.Col>
                      <Table.Col>
                        <BadgeBookingStatus status={node.bookingStatus} />
                        <ButtonConfirm 
                              title={t("schedule.classes.class.attendance.confirm_resending_info_mail_title")}
                              msgConfirm={<p>{t("schedule.classes.class.attendance.confirm_resending_info_mail_to")}</p>}
                              msgDescription={<p><b>{node.account.fullName}</b></p>}
                              msgSuccess={t("schedule.classes.class.attendance.resend_success")}
                              actionFunction={resendInfoMail}
                              actionFunctionVariables={{variables: {input: {id: node.id}}}}
                              buttonClass="btn-link float-right"
                              buttonIcon={<Icon name="send" />}
                              buttonText={t("schedule.classes.class.attendance.resend_info_mail")}
                              buttonTextColor=""
                          />
                      </Table.Col>
                      <Table.Col>
                        {/* Delete */}
                        <ScheduleClassAttendanceDelete node={node} />
                        {/* Status dropdown */}
                        <Dropdown
                          key={v4()}
                          className="float-right"
                          type="button"
                          toggle
                          color="secondary btn-sm"
                          triggerContent={t("general.status")}
                          items={[
                            // <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
                            //   <Dropdown.Item
                            //     key={v4()}
                            //     icon="check"
                            //     onClick={() => {
                            //       setAttendanceStatus({
                            //         t: t, 
                            //         updateAttendance: updateAttendance,
                            //         node: node,
                            //         status: 'ATTENDING'
                            //       })
                            //       refetchAttendance()
                            //     }}>
                            //       {t('schedule.classes.class.attendance.booking_status.ATTENDING')}
                            //   </Dropdown.Item>
                            // </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
                              <Dropdown.Item
                                key={v4()}
                                icon="calendar"
                                onClick={() => {
                                  setAttendanceStatus({
                                    t: t, 
                                    match: match,
                                    updateAttendance: updateAttendance,
                                    node: node,
                                    status: 'BOOKED',
                                    setAttendanceRefetching: setAttendanceRefetching
                                  })
                                }}>
                                  {t('schedule.classes.class.attendance.booking_status.BOOKED')}
                              </Dropdown.Item>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
                              <Dropdown.Item
                                key={v4()}
                                icon="x"
                                onClick={() => {
                                  setAttendanceStatus({
                                    t: t, 
                                    match: match,
                                    updateAttendance: updateAttendance,
                                    node: node,
                                    status: 'CANCELLED',
                                    setAttendanceRefetching: setAttendanceRefetching
                                  })
                                }}>
                                  {t('schedule.classes.class.attendance.booking_status.CANCELLED')}
                              </Dropdown.Item>
                            </HasPermissionWrapper>,
                          ]}
                        />
                        {(node.bookingStatus === "BOOKED") ?
                          <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
                            <Button
                              key={v4()}
                              className="float-right"
                              color="success"
                              size="sm"
                              onClick={() => {
                                setAttendanceStatus({
                                  t: t, 
                                  match: match,
                                  updateAttendance: updateAttendance,
                                  node: node,
                                  status: 'ATTENDING',
                                  setAttendanceRefetching: setAttendanceRefetching
                                })
                              }}>
                                {t('general.checkin')}
                            </Button>
                          </HasPermissionWrapper>  : "" }
                      </Table.Col>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </Dimmer>
        }
      </ContentCard>
    </ScheduleClassAttendanceBase>
  )
}


export default withTranslation()(withRouter(ScheduleClassAttendance))
