import CSLS from "../../../tools/cs_local_storage"

export function get_list_query_variables() {
  let queryVars = {}

  let supplier = localStorage.getItem(CSLS.FINANCE_EXPENSES_FILTER_SUPPLIER)
  if (supplier) {
    queryVars.supplier = supplier
  } else {
    queryVars.supplier = undefined
  }
  
  console.log(queryVars)

  return queryVars
}

