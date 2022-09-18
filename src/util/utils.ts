export const getKSTDate = (utc: Date): Date => {
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kst = new Date(utc.getTime() + KR_TIME_DIFF);
  return kst;
};
