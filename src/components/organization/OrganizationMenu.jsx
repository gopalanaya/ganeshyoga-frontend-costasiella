// @flow

import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'

import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../HasPermissionWrapper"


let classpasses_active
let classtypes_active
let discoveries_active
let documents_active
let languages_active
let locations_active
let levels_active
let memberships_active
let subscriptions_active
let appointments_active
let organization_active
let organization_branding_active
let announcements_active

const OrganizationMenu = ({ t, activeLink }) => (
    <List.Group transparent={true}>
        {(activeLink === 'classpasses') ? classpasses_active = true: classpasses_active = false}
        {(activeLink === 'classtypes') ? classtypes_active = true: classtypes_active = false}
        {(activeLink === 'discoveries') ? discoveries_active = true: discoveries_active = false}
        {(activeLink === 'documents') ? documents_active = true: documents_active = false}
        {(activeLink === 'languages') ? languages_active = true: languages_active = false}
        {(activeLink === 'locations') ? locations_active = true: locations_active = false}
        {(activeLink === 'levels') ? levels_active = true: levels_active = false}
        {(activeLink === 'memberships') ? memberships_active = true: memberships_active = false}
        {(activeLink === 'subscriptions') ? subscriptions_active = true: subscriptions_active = false}
        {(activeLink === 'appointments') ? appointments_active = true: appointments_active = false}
        {(activeLink === 'organization') ? organization_active = true: organization_active = false}
        {(activeLink === 'organization_branding') ? organization_branding_active = true: organization_branding_active = false}
        {(activeLink === 'announcements') ? announcements_active = true: announcements_active = false}
        

        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/edit/T3JnYW5pemF0aW9uTm9kZToxMDA="
            icon="layout"
            active={organization_active}
            >
            {t('organization.organization.title')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/locations"
            icon="home"
            active={locations_active}
            >
            {t('organization.locations.title')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/classtypes"
            icon="book-open"
            active={classtypes_active}
            >
            {t('organization.classtypes.title')}
        </List.GroupItem>
        {/* <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/memberships"
            icon="clipboard"
            active={memberships_active}
            >
            {t('organization.memberships.title')}
        </List.GroupItem> */}
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/classpasses"
            icon="credit-card"
            active={classpasses_active}
            >
            {t('organization.classpasses.title')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/subscriptions"
            icon="edit"
            active={subscriptions_active}
            >
            {t('organization.subscriptions.title')}
        </List.GroupItem>
        {/* <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/appointment_categories"
            icon="calendar"
            active={appointments_active}
            >
            {t('organization.appointments.title')}
        </List.GroupItem> */}
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/levels"
            icon="tag"
            active={levels_active}
            >
            {t('organization.levels.title')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/discoveries"
            icon="compass"
            active={discoveries_active}
            >
            {t('organization.discoveries.title')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/languages"
            icon="flag"
            active={languages_active}
            >
            {t('organization.languages.title')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/edit/T3JnYW5pemF0aW9uTm9kZToxMDA=/branding"
            icon="image"
            active={organization_branding_active}
            >
            {t('organization.organization.branding.title')}
        </List.GroupItem>
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to="#/organization/documents/T3JnYW5pemF0aW9uTm9kZToxMDA="
            icon="briefcase"
            active={documents_active}
            >
            {t('organization.documents.title')}
        </List.GroupItem>
        <HasPermissionWrapper permission="view"
                              resource="organizationannouncement">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to="#/organization/announcements"
                icon="message-square"
                active={announcements_active}
                >
                {t('organization.announcements.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
    </List.Group>
);

export default withTranslation()(OrganizationMenu)