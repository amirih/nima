import axios from "axios";
import { useState, useEffect } from "react";

function HomePage() {
  const [reorderedData, setReorderedData] = useState({});
  const [apiURL, setApiURL] = useState("/api/data");
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

  const onSubmit = () => {
    pars(apiURL).then((data) => {
      setReorderedData(data);
    });
  };

  useEffect(() => {
    pars(apiURL).then((data) => {
      setReorderedData(data);
    });
  }, []);

  return (
    <div>
      <input
        style={{ padding: "1rem", fontSize: "2rem", borderRadius: "1rem" }}
        type="text"
        value={apiURL}
        onChange={(e) => setApiURL(e.target.value)}
      />
      <button
        style={{
          margin: "1rem",
          padding: "1rem",
          fontSize: "2rem",
          backgroundColor: "#33BDFF",
          borderRadius: "1rem",
        }}
        onSubmit={onSubmit}
      >
        Parse the Content
      </button>
      <pre>{JSON.stringify(reorderedData, null, 3)}</pre>
    </div>
  );
}

export default HomePage;
