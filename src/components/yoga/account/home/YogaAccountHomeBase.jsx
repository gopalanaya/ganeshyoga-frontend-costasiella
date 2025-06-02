import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
    Page,
    Container
} from "tabler-react"
import SiteWrapperYoga from '../../../SiteWrapperYoga'

function YogaAccountHomeBase({t, match, history, children, subTitle=""}){
    return (
        <SiteWrapperYoga>
            <div className='my-3 my-md-5'>
                <Container>
                    <Page.Header title={t("shop.account.title")} subTitle={subTitle}/>
                    {children}
                </Container>
            </div>
        </SiteWrapperYoga>
    )
}

export default withTranslation()(withRouter(YogaAccountHomeBase))