import { render, screen } from "@testing-library/react";
import Detail from "../pages/Detail/index";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import { exa_data } from "../constants";

//test ortemındaki sahte store'un kurumun yap
const mockStore = configureStore([thunk]);

it("Yüklenme durumunda Loader bileşenleri ekrana basılır", () => {
  //üklenme durumundaki store 2u simüle et
  const store = mockStore({ isLoding: true, error: null, data: null });
  render(
    <BrowserRouter>
      <Provider store={store}>
        <Detail />
      </Provider>
    </BrowserRouter>
  );
  // loader'lar ekrana gelyor mu
  screen.getByTestId("header-loader");
  screen.getAllByTestId("card-loader");
});

it("Hata durumunda error bileşeni ekrana basılır", () => {
  const store = mockStore({
    isLoding: false,
    error: "404 content not found",
    data: null,
  });
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Detail />
      </BrowserRouter>
    </Provider>
  );
  //Hatanın metnini içeren element ekrana basıldı mı?
  screen.getByText(/404 content/i);
});

it("Veri gelme durumunda ülke bilgisi ve kartlar ekrana basılır", () => {
  //Veri gelme durumunda store'u simüle et
  const store = mockStore({
    isLoding: false,
    error: null,
    data: exa_data,
  });
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Detail />
      </BrowserRouter>
    </Provider>
  );
  // 1) Ülke detayları ekrana geliyor mu?

  // Ülke ismi ekrana geliyor mu?
  screen.getByText("Turkiye");

  // Ekrandaki remi al
  const img = screen.getByRole("img");

  // Resmin kaynağı doğru mu?
  expect(img).toHaveProperty("src", exa_data.country.flags.png);

  // 2) Kartlar ekrana geliyor mu?

  //covid nesnesini diziye çevir
  const arr = Object.entries(exa_data.covid);

  //dizideki bütün elemanların key ve vLUE DEĞERLERİ EKRANA BASILIYOR MU?
  arr.forEach((item) => {
    //başlık ekrana geldi mi?
    screen.getByText(item[0].split("_").join(" "));
    //değer ekrana geldi mi?
    screen.getByText(item[1]);
  });
});
