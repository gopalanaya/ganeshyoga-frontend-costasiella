// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ShopBase from "../ShopBase"

function ShopClasspassBase({ t, match, history, pageTitle, pageSubTitle, children }) {
  
  return (
    <ShopBase 
      title={pageTitle}
      subTitle={pageSubTitle}
      returnUrl="/shop/classpasses"
      checkoutProgress="order"
    >
      {children}
    </ShopBase>
  )
}


export default withTranslation()(withRouter(ShopClasspassBase))