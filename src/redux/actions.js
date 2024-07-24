import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const axios = require("axios");

const covidUrl = "https://covid-19-statistics.p.rapidapi.com/reports";

const headers = {
  "x-rapidapi-key": "41f4b3175emshc60b87d916dc889p17880ejsna8334502f3ff",
  "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
};

const getData = createAsyncThunk("covid/getData", async ({ code, query }) => {
  // api'a gönderilcek parametreleri hazırla
  const params = { iso: code, q: query };
  //isoCode'e göre covid verileri al
  const req1 = await axios.get(covidUrl, { params, headers });

  //isoCode'e göre Ülke verileri al
  const req2 = axios.get(
    code
      ? `https://restcountries.com/v3.1/alpha/${code}`
      : `https://restcountries.com/v3.1/name/${query}`
  );
  // Her iki api isteği aynı anda paralel olarak atıyoruzs
  const responses = await Promise.all([req1, req2]);
  //Region nesnesindeki değerler bir üst nesneye çıkarımı
  const covid = {
    ...responses[0].data.data[0],
    ...responses[0].data.data[0].region,
  };
  //Gereksiz değerleri kaldır
  delete covid.cities;
  delete covid.region;

  // payloadı rturn et
  return { covid, country: responses[1].data[0] };
});
export default getData;
