import lodash from "lodash";

export const getMySheet = (sheet, vals) => {
  const mySh = lodash.clone(sheet).filter((sh) => {
    sh.children = lodash.clone(sh?.children)?.filter((s) => {

      if (!!vals?.owner && s.Owner !== vals?.owner) return false;
      // if (!!vals.startDate && s["Start Date"] !== vals.startDate) return false;
      // if (!!vals.endDate && s["End Date"] !== vals.endDate) return false;
      return true;
    });

    return !!sh?.children?.length;
  });
  return lodash.clone(mySh);
};