// DOM Initializations

const regionOpt = document.getElementById("formRegion");
const cityMunProvOpt = document.getElementById("formCityMunProv");
const barangayOpt = document.getElementById("formBarangay");

const CONFIG = {
  API_URL: "https://192.168.51.38/acms-api/public/api/v1/clients/PSGC",
  API_KEY:
    "Bearer 0e21f9bd86a420eac2046060e7e806b42858de4a4a68d5f17de82261957e6822",
  REGION_EP: "ListOfRegion",
  PROVINCE_EP: "ListOfProvince",
  CITIESMUN_EP: "ListOfCityMuncipalityByRegion",
  CITIES_EP: "ListOfCity", //
  MUNICIPALITIES_EP: "ListOfMunicipality",
  SUBMUN_EP: "ListOfSubMunicipality",
  BARANGAYS_EP: "ListOfBgy",
  BARANGAYS_CITY_EP: "ListOfBgyByCity",
  BARANGAYS_MUN_EP: "ListOfBgyByMun",
  BARANGAYS_SUBMUN_EP: "ListOfBgyBySubMun",
  BARANGAYS_CITY_PARAM: "CityCode",
  BARANGAYS_MUN_PARAM: "MunicipalityCode",
  BARANGAYS_SUBMUN_PARAM: "SubMunicipalityCode",
  REGIONCODE_PARAM: "RegionCode",
  DEFAULT_EP: "ListOfRegion",
};

const defaultOptions = {
  headers: {
    Accept: "application/json",
    Authorization: `${CONFIG.API_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    Origin: "http://localhost",
  },
};

const fetchLocation = async (
  fetchData,
  options = defaultOptions,
  method = "GET"
) => {
  const { fetchMethod, endpoint } = fetchData;

  const URL_CONFIG = {
    FETCH_WHOLE_REGION: `${CONFIG.API_URL}/${CONFIG.REGION_EP}`,
    FETCH_CITYMUN_BY_REGION: `${CONFIG.API_URL}/${CONFIG.CITIESMUN_EP}?${CONFIG.REGIONCODE_PARAM}=${endpoint}`,
    FETCH_BARANGAY_BY_CITY: `${CONFIG.API_URL}/${CONFIG.BARANGAYS_CITY_EP}?${CONFIG.BARANGAYS_CITY_PARAM}=${endpoint}`,
    FETCH_BARANGAY_BY_MUN: `${CONFIG.API_URL}/${CONFIG.BARANGAYS_MUN_EP}?${CONFIG.BARANGAYS_MUN_PARAM}=${endpoint}`,
    FETCH_BARANGAY_BY_SUBMUN: `${CONFIG.API_URL}/${CONFIG.BARANGAYS_SUBMUN_EP}?${CONFIG.BARANGAYS_SUBMUN_PARAM}=${endpoint}`,
  };

  let apiUrl = "";

  try {
    switch (fetchMethod) {
      case "FETCH_WHOLE_REGION":
        apiUrl = URL_CONFIG.FETCH_WHOLE_REGION;
        console.log("Regions URL: ", apiUrl);
        break;
      case "FETCH_CITYMUN_BY_REGION":
        apiUrl = URL_CONFIG.FETCH_CITYMUN_BY_REGION;
        console.log("City/Municipalities URL: ", apiUrl);
        break;
      case "FETCH_BARANGAY_BY_CITY":
        apiUrl = URL_CONFIG.FETCH_BARANGAY_BY_CITY;
        console.log("Barangay by City URL: ", apiUrl);
        break;
      case "FETCH_BARANGAY_BY_MUN":
        apiUrl = URL_CONFIG.FETCH_BARANGAY_BY_MUN;
        console.log("Barangay by Municipality URL: ", apiUrl);
        break;
      case "FETCH_BARANGAY_BY_SUBMUN":
        apiUrl = URL_CONFIG.FETCH_BARANGAY_BY_SUBMUN;
        console.log("Barangay by Sub-Municipality URL: ", apiUrl);
        break;
      default:
        console.log("Invalid fetch method!");
    }
    // Fetch Request
    const response = await fetch(apiUrl, { method: method, ...options });
    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

const loadRegion = () => {
  cityMunProvOpt.disabled = true;
  barangayOpt.disabled = true;
  cityMunProvOpt.style.pointerEvents = "none";
  barangayOpt.style.pointerEvents = "none";

  fetchLocation({
    fetchMethod: "FETCH_WHOLE_REGION",
    regionCode: null,
  }).then((response) => {
    console.log("Regions:", response.data);
    response.data.forEach((region) => {
      const option = document.createElement("option");
      option.value = region.PSGC_Code;
      option.textContent = region.Display;
      regionOpt.appendChild(option);
    });
  });
};

const loadCityMunProv = () => {
  cityMunProvOpt.disabled = true; // Disable until the data is fully fetched.
  cityMunProvOpt.style.pointerEvents = "auto";

  barangayOpt.disabled = true;
  barangayOpt.style.pointerEvents = "none";

  const regionCode = regionOpt.value;

  cityMunProvOpt.innerHTML =
    "<option value='' selected disabled>SELECT CITY/MUNICIPALITY, PROVINCE</option>";
  barangayOpt.innerHTML =
    "<option value='' selected disabled>SELECT BARANGAY</option>";

  fetchLocation({
    fetchMethod: "FETCH_REGION",
    regionCode: regionCode,
    endpoint: CONFIG.CITIESMUN_EP,
  }).then((response) => {
    // console.log("Cities/Municipalities: ", response);
    response.forEach((cityMun) => {
      const option = document.createElement("option");
      option.value = cityMun.code;
      option.textContent = cityMun.name;
      cityMunProvOpt.appendChild(option);
      cityMunProvOpt.disabled = false;
      cityMunProvOpt.style.pointerEvents = "auto";
    });
  });
};

const loadBarangay = () => {
  barangayOpt.disabled = true; // Disabled until the data is fully fetched.
  barangayOpt.style.pointerEvents = "auto";

  barangayOpt.innerHTML = "<option value=''>SELECT BARANGAY</option>";

  const cityMunCode = cityMunProvOpt.value;

  // console.log("CityMunProv: ", cityMunCode);

  fetchLocation({
    fetchMethod: "FETCH_CITYMUN_BARANGAY",
    cityMunCode: cityMunCode,
    endpoint: CONFIG.BARANGAYS_EP,
  }).then((response) => {
    // console.log("Barangays: ", response);
    response.forEach((barangay) => {
      const option = document.createElement("option");
      option.value = barangay.code;
      option.textContent = barangay.name;
      barangayOpt.appendChild(option);
      barangayOpt.disabled = false;
      barangayOpt.style.pointerEvents = "auto";
    });
  });
};

window.onload = loadRegion;
