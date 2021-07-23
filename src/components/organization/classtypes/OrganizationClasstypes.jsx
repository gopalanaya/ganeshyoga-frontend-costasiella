// @flow

import React from 'react'
import { useQuery, Mutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Avatar,
  Page,
  Grid,
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Container,
  Table
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
// import { confirmAlert } from 'react-confirm-alert'; // Import
import { toast } from 'react-toastify'

import ContentCard from "../../general/ContentCard"
import OrganizationMenu from "../OrganizationMenu"

import { GET_CLASSTYPES_QUERY } from "./queries"
import OrganizationClasstypesBase from "./OrganizationClasstypesBase"

const ARCHIVE_CLASSTYPE = gql`
    mutation ArchiveOrganizationClasstype($input: ArchiveOrganizationClasstypeInput!) {
        archiveOrganizationClasstype(input: $input) {
          organizationClasstype {
            id
            archived
          }
        }
    }
`

function OrganizationClasstypes({t, history, archived=false}) {
  const {loading, error, data, refetch, fetchMore} = useQuery(GET_CLASSTYPES_QUERY, { variables: {
    archived:archived
  }})

  if (loading) return (
    <OrganizationClasstypesBase>
      <ContentCard cardTitle={t('organization.classtypes.title')}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
  // Error
  if (error) return (
    <OrganizationClasstypesBase>
      <ContentCard cardTitle={t('organization.classtypes.title')}>
        <p>{t('organization.classtypes.error_loading')}</p>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
  const headerOptions = <Card.Options>
    <Button color={(!archived) ? 'primary': 'secondary'}  
            size="sm"
            onClick={() => {archived=false; refetch({archived});}}>
      {t('general.current')}
    </Button>
    <Button color={(archived) ? 'primary': 'secondary'} 
            size="sm" 
            className="ml-2" 
            onClick={() => {archived=true; refetch({archived});}}>
      {t('general.archive')}
    </Button>
  </Card.Options>
  
  const classtypes = data.organizationClasstypes
  // Empty list
  if (!classtypes.edges.length) { return (
    <OrganizationClasstypesBase>
      <ContentCard cardTitle={t('organization.classtypes.title')}
                  headerContent={headerOptions}>
        <p>
        {(!archived) ? t('organization.classtypes.empty_list') : t("organization.classtypes.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationClasstypesBase>
  )}   

  return (
    <OrganizationClasstypesBase>
      <ContentCard cardTitle={t('organization.classtypes.title')}
                   headerContent={headerOptions}
                   pageInfo={classtypes.pageInfo}
                   onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: classtypes.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.organizationClasstypes.edges
                        const pageInfo = fetchMoreResult.organizationClasstypes.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new locations at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              organizationClasstypes: {
                                __typename: previousResult.organizationClasstypes.__typename,
                                edges: [ ...previousResult.organizationClasstypes.edges, ...newEdges ],
                                pageInfo
                              }
                            }
                          : previousResult
                      }
                    })
                  }} 
      >
        <Table>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('')}</Table.ColHeader>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.public')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {classtypes.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    <Avatar size="lg" imageURL={node.urlImageThumbnailSmall} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.displayPublic) ? 
                      <Badge color="success">{t('general.yes')}</Badge>: 
                      <Badge color="danger">{t('general.no')}</Badge>}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <div>
                        <Button className='btn-sm' 
                                onClick={() => history.push("/organization/classtypes/edit/" + node.id)}
                                color="secondary">
                          {t('general.edit')}
                        </Button>
                        <Button className='btn-sm' 
                                onClick={() => history.push("/organization/classtypes/edit_image/" + node.id)}
                                color="secondary">
                          {t('organization.classtypes.edit_image')}
                        </Button>
                      </div>
                    }
                  </Table.Col>
                  <Mutation mutation={ARCHIVE_CLASSTYPE} key={v4()}>
                    {(archiveLocation, { data }) => (
                      <Table.Col className="text-right" key={v4()}>
                        <button className="icon btn btn-link btn-sm" 
                            title={t('general.archive')} 
                            onClick={() => {
                              console.log("clicked archived")
                              let id = node.id
                              archiveLocation({ variables: {
                                input: {
                                id,
                                archived: !archived
                                }
                        }, refetchQueries: [
                            {query: GET_CLASSTYPES_QUERY, variables: {"archived": archived }}
                        ]}).then(({ data }) => {
                          console.log('got data', data);
                          toast.success(
                            (archived) ? t('general.unarchived'): t('general.archived'), {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                        }).catch((error) => {
                          toast.error((t('general.toast_server_error')) + ': ' +  error, {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                          console.log('there was an error sending the query', error);
                        })
                        }}>
                          <Icon prefix="fa" name="inbox" />
                        </button>
                      </Table.Col>
                    )}
                  </Mutation>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
}

// const OrganizationClasstypes = ({ t, history, archived=false }) => (
//   <SiteWrapper>
//     <div className="my-3 my-md-5">
//       <Container>
//         <Page.Header title="Organization" />
//         <Grid.Row>
//           <Grid.Col md={9}>
//             <Query query={GET_CLASSTYPES_QUERY} variables={{ archived }}>
//             {({ loading, error, data: {organizationClasstypes: classtypes}, refetch, fetchMore }) => {
//                 // Loading
//                 if (loading) return (
//                   <ContentCard cardTitle={t('organization.classtypes.title')}>
//                     <Dimmer active={true}
//                             loader={true}>
//                     </Dimmer>
//                   </ContentCard>
//                 )
//                 // Error
//                 if (error) return (
//                   <ContentCard cardTitle={t('organization.classtypes.title')}>
//                     <p>{t('organization.classtypes.error_loading')}</p>
//                   </ContentCard>
//                 )
//                 const headerOptions = <Card.Options>
//                   <Button color={(!archived) ? 'primary': 'secondary'}  
//                           size="sm"
//                           onClick={() => {archived=false; refetch({archived});}}>
//                     {t('general.current')}
//                   </Button>
//                   <Button color={(archived) ? 'primary': 'secondary'} 
//                           size="sm" 
//                           className="ml-2" 
//                           onClick={() => {archived=true; refetch({archived});}}>
//                     {t('general.archive')}
//                   </Button>
//                 </Card.Options>
                
//                 // Empty list
//                 if (!classtypes.edges.length) { return (
//                   <ContentCard cardTitle={t('organization.classtypes.title')}
//                                headerContent={headerOptions}>
//                     <p>
//                     {(!archived) ? t('organization.classtypes.empty_list') : t("organization.classtypes.empty_archive")}
//                     </p>
                   
//                   </ContentCard>
//                 )} else {   
//                 // Life's good! :)
//                 return (
//                   <ContentCard cardTitle={t('organization.classtypes.title')}
//                                headerContent={headerOptions}
//                                pageInfo={classtypes.pageInfo}
//                                onLoadMore={() => {
//                                 fetchMore({
//                                   variables: {
//                                     after: classtypes.pageInfo.endCursor
//                                   },
//                                   updateQuery: (previousResult, { fetchMoreResult }) => {
//                                     const newEdges = fetchMoreResult.organizationClasstypes.edges
//                                     const pageInfo = fetchMoreResult.organizationClasstypes.pageInfo

//                                     return newEdges.length
//                                       ? {
//                                           // Put the new locations at the end of the list and update `pageInfo`
//                                           // so we have the new `endCursor` and `hasNextPage` values
//                                           organizationClasstypes: {
//                                             __typename: previousResult.organizationClasstypes.__typename,
//                                             edges: [ ...previousResult.organizationClasstypes.edges, ...newEdges ],
//                                             pageInfo
//                                           }
//                                         }
//                                       : previousResult
//                                   }
//                                 })
//                               }} >
//                     <Table>
//                           <Table.Header>
//                             <Table.Row key={v4()}>
//                               <Table.ColHeader>{t('')}</Table.ColHeader>
//                               <Table.ColHeader>{t('general.name')}</Table.ColHeader>
//                               <Table.ColHeader>{t('general.public')}</Table.ColHeader>
//                             </Table.Row>
//                           </Table.Header>
//                           <Table.Body>
//                               {classtypes.edges.map(({ node }) => (
//                                 <Table.Row key={v4()}>
//                                   <Table.Col key={v4()}>
//                                     <Avatar size="lg" imageURL={node.urlImageThumbnailSmall} />
//                                   </Table.Col>
//                                   <Table.Col key={v4()}>
//                                     {node.name}
//                                   </Table.Col>
//                                   <Table.Col key={v4()}>
//                                     {(node.displayPublic) ? 
//                                       <Badge color="success">{t('general.yes')}</Badge>: 
//                                       <Badge color="danger">{t('general.no')}</Badge>}
//                                   </Table.Col>
//                                   <Table.Col className="text-right" key={v4()}>
//                                     {(archived) ? 
//                                       <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
//                                       <div>
//                                         <Button className='btn-sm' 
//                                                 onClick={() => history.push("/organization/classtypes/edit/" + node.id)}
//                                                 color="secondary">
//                                           {t('general.edit')}
//                                         </Button>
//                                         <Button className='btn-sm' 
//                                                 onClick={() => history.push("/organization/classtypes/edit_image/" + node.id)}
//                                                 color="secondary">
//                                           {t('organization.classtypes.edit_image')}
//                                         </Button>
//                                       </div>
//                                     }
//                                   </Table.Col>
//                                   <Mutation mutation={ARCHIVE_CLASSTYPE} key={v4()}>
//                                     {(archiveLocation, { data }) => (
//                                       <Table.Col className="text-right" key={v4()}>
//                                         <button className="icon btn btn-link btn-sm" 
//                                            title={t('general.archive')} 
//                                            onClick={() => {
//                                              console.log("clicked archived")
//                                              let id = node.id
//                                              archiveLocation({ variables: {
//                                                input: {
//                                                 id,
//                                                 archived: !archived
//                                                }
//                                         }, refetchQueries: [
//                                             {query: GET_CLASSTYPES_QUERY, variables: {"archived": archived }}
//                                         ]}).then(({ data }) => {
//                                           console.log('got data', data);
//                                           toast.success(
//                                             (archived) ? t('general.unarchived'): t('general.archived'), {
//                                               position: toast.POSITION.BOTTOM_RIGHT
//                                             })
//                                         }).catch((error) => {
//                                           toast.error((t('general.toast_server_error')) + ': ' +  error, {
//                                               position: toast.POSITION.BOTTOM_RIGHT
//                                             })
//                                           console.log('there was an error sending the query', error);
//                                         })
//                                         }}>
//                                           <Icon prefix="fa" name="inbox" />
//                                         </button>
//                                       </Table.Col>
//                                     )}
//                                   </Mutation>
//                                 </Table.Row>
//                               ))}
//                           </Table.Body>
//                         </Table>
//                   </ContentCard>
//                 )}}
//              }
//             </Query>
//           </Grid.Col>
//           <Grid.Col md={3}>
//             <HasPermissionWrapper permission="add"
//                                   resource="organizationclasstype">
//               <Button color="primary btn-block mb-6"
//                       onClick={() => history.push("/organization/classtypes/add")}>
//                 <Icon prefix="fe" name="plus-circle" /> {t('organization.classtypes.add')}
//               </Button>
//             </HasPermissionWrapper>
//             <OrganizationMenu active_link='classtypes'/>
//           </Grid.Col>
//         </Grid.Row>
//       </Container>
//     </div>
//   </SiteWrapper>
// );

export default withTranslation()(withRouter(OrganizationClasstypes))