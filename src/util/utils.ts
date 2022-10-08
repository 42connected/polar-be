export const getKSTDate = (utc: Date): Date => {
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kst = new Date(utc.getTime() + KR_TIME_DIFF);
  return kst;
};

export const getTotalHour = (times: Date[]): number => {
  const hour = 1000 * 60 * 60;
  return (times[1].getTime() - times[0].getTime()) / hour;
};
