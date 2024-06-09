/*
任意の小数点の桁（scale）で四捨五入
*/
export const roundWithScale = (value: number, scale: number) => {
    return Math.round(value * 10 ** scale) / 10 ** scale;
  };