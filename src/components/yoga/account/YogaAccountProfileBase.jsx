import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
    Page,
    Container
} from "tabler-react";

import SiteWrapperYoga from '../../SiteWrapperYoga'
import YogaAccountBack from "./YogaAccountBack"

function YogaAccountProfileBase({t, match, history, children, accountName=""}){
    return (
      <SiteWrapperYoga>
        <div className='my-3 my-md-5'>
            <Container>
                <Page.Header title={t('shop.account.title')} subTitle={accountName}>
                    <div className='page-options d-flex'>
                        <YogaAccountBack/>
                    </div>
                </Page.Header>
                { children }
            </Container>
        </div>
      </SiteWrapperYoga>
    )
}

export default withTranslation()(withRouter(YogaAccountProfileBase))