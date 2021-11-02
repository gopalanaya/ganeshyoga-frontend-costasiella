import { gql } from "@apollo/client"


export const GET_ACCOUNT_TEACHER_PROFILE_QUERY = gql`
  query AccountTeacherProfileQuery($id: ID!) {
    accountTeacherProfiles(account:$id) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          account {
            id
          }
          classes
          appointments
          events
          role
          education
          bio
          urlBio
          urlWebsite   
        }
      }
    }
    account(id:$id) {
      id
      teacher
      firstName
      lastName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`


export const UPDATE_ACCOUNT_TEACHER_PROFILE = gql`
  mutation UpdateAccountTeacherProfile($input:UpdateAccountTeacherProfileInput!) {
    updateAccountTeacherProfile(input: $input) {
      accountTeacherProfile {
        id
      }
    }
  }
`

