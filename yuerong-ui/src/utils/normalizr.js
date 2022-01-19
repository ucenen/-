import _ from "lodash";

export default function normalizr(data, key = "id") {
  return _.zipObject(_.map(data, key), data);
}
