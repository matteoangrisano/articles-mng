export const call: any = async (event): Promise<any> => {
  console.log(process.env.REGION);
  console.log(process.env.DOMAIN);
};
