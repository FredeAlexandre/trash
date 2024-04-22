function valorantApiGetDate(time: string) {
  return new Date(time.replace("Z", "") + "+02:00");
}

export default valorantApiGetDate;
