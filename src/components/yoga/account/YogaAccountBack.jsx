import React from "react"
import { withTranslation  } from "react-i18next"
import ButtonBack from "../../ui/ButtonBack"

function YogaAccountBack({t, returnUrl="/yoga"}) {

    return (
        <ButtonBack returnUrl={returnUrl} />
    )
}

export default withTranslation()(YogaAccountBack)