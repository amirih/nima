const axios = require("axios");

const getDataFromAPI = async (URL) => {
  const response = await axios.get(URL);
  return response?.data?.items;
};

const getParents = async (items) => {
  const parents = items.filter((item) => {
    return item.parent === 0;
  });
  return parents;
};

const getRestItems = async (items) => {
  const restItems = items.filter((item) => {
    return item.parent !== 0;
  });
  return restItems;
};

const reorderItems = async (parents, restItems) => {
  if (restItems.length === 0) {
    return;
  }

  parents.forEach((parent) => {
    const children = restItems.filter((item) => {
      return item.parent === parent.id;
    });
    if (children.length !== 0) {
      restItems = restItems.filter((item) => {
        return item.parent !== parent.id;
      });
      parent["children"] = children;
      reorderItems(parent["children"], restItems);
    }
  });
};
const pars = async (URL) => {
  const items = await getDataFromAPI(URL);
  const parents = await getParents(items);
  const restItems = await getRestItems(items);
  await reorderItems(parents, restItems);
  return parents;
};

pars("https://drjanebi.com/api/system/pages").then((data) => {
  console.log(JSON.stringify(data));
});
