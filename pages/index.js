import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [stationCount, setStationCount] = useState(0);
  const [sort, setSort] = useState("");
  const [fetched, setFetched] = useState(false);

  function sortById() {
    const compare = (a, b) => {
      if (a.station_id > b.station_id) return 1;
      if (b.station_id > a.station_id) return -1;

      return 0;
    };

    setStations(stations.sort(compare));
    setSort("id");
  }

  function sortByBikeNum() {
    const compare = (a, b) => {
      if (a.num_bikes_available > b.num_bikes_available) return 1;
      if (b.num_bikes_available > a.num_bikes_available) return -1;

      return 0;
    };

    setStations(stations.sort(compare));
    setSort("bikes");
  }

  useEffect(() => {
    if (!fetched) {
      fetch(
        "https://toronto-us.publicbikesystem.net/ube/gbfs/v1/en/station_status"
      ).then((response) => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }

        response.json().then(function (data) {
          if (data && data.data && data.data.stations) {
            setFetched(true);
            setStationCount(data.data.stations.length);
            setStations(data.data.stations);
          }
        });
      });
    }
    console.log(sort);
  }, [stationCount, sort]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Toronto bike stations listing</h1>

        <button onClick={sortById}>Sort by station_id</button>
        <button onClick={sortByBikeNum}>Sort by num_bikes_available</button>

        <table>
          <thead>
            <tr>
              <th>station_id</th>
              <th>num_bikes_available</th>
              <th>num_bikes_disabled</th>
              <th>num_docks_available</th>
              <th>is_installed</th>
              <th>is_renting</th>
              <th>is_returning</th>
              <th>last_reported</th>
              <th>is_charging_station</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => {
              return (
                <tr key={`station-id-${station["station_id"]}`}>
                  <td>{station["station_id"]}</td>
                  <td>{station["num_bikes_available"]}</td>
                  <td>{station["num_bikes_disabled"]}</td>
                  <td>{station["num_docks_available"]}</td>
                  <td>{station["is_installed"]}</td>
                  <td>{station["is_renting"]}</td>
                  <td>{station["is_returning"]}</td>
                  <td>{station["last_reported"]}</td>
                  <td>{station["is_charging_station"]}</td>
                  <td>{station["status"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}
