import valorantApiGetDate from "./valorantApiGetDate";

function isIsoDate(str: string) {
  const re =
    /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  return re.test(str);
}

function apiTransformDates(data: any) {
  if (typeof data != "object" || data == null) return data;

  for (const key in data) {
    if (typeof data[key] == "string" && isIsoDate(data[key])) {
      data[key] = valorantApiGetDate(data[key]);
    } else if (typeof data[key] == "object" && data[key] != null) {
      data[key] = apiTransformDates(data[key]);
    }
  }

  return data;
}

export default apiTransformDates;
