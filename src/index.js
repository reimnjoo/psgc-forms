// DOM Initializations

const regionOpt = document.getElementById("formRegion");
const cityMunProvOpt = document.getElementById("formCityMunProv");
const barangayOpt = document.getElementById("formBarangay");

const CONFIG = {
  API_URL: "https://psgc.cloud/api",
  REGION_EP: "regions",
  PROVINCE_EP: "provinces",
  CITIESMUN_EP: "cities-municipalities",
  CITIES_EP: "cities", //
  MUNICIPALITIES_EP: "municipalities",
  SUBMUN_EP: "sub-municipalities",
  BARANGAYS_EP: "barangays",
  DEFAULT_EP: "regions",
};

const defaultOptions = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const fetchLocation = async (
  fetchData,
  options = defaultOptions,
  method = "GET"
) => {
  const { fetchMethod, regionCode, endpoint, cityMunCode } = fetchData;

  const URL_CONFIG = {
    FETCH_WHOLE_REGION: `${CONFIG.API_URL}/${CONFIG.REGION_EP}`,
    FETCH_SINGLE_REGION: `${CONFIG.API_URL}/${CONFIG.REGION_EP}/${regionCode}`,
    FETCH_REGION_SUBDATA: `${CONFIG.API_URL}/${CONFIG.REGION_EP}/${regionCode}/${endpoint}`,
    FETCH_CITYMUN_BARANGAY: `${CONFIG.API_URL}/${CONFIG.CITIESMUN_EP}/${cityMunCode}/${endpoint}`,
  };

  let apiUrl = "";

  try {
    switch (fetchMethod) {
      case "FETCH_WHOLE_REGION":
        apiUrl = URL_CONFIG.FETCH_WHOLE_REGION;
        // console.log("Regions URL: ", apiUrl);
        break;
      case "FETCH_SINGLE_REGION":
        apiUrl = URL_CONFIG.FETCH_SINGLE_REGION;
        // console.log("City/Municipalities URL: ", apiUrl);
        break;
      case "FETCH_REGION_SUBDATA":
        apiUrl = URL_CONFIG.FETCH_REGION_SUBDATA;
        break;
      case "FETCH_CITYMUN_BARANGAY":
        apiUrl = URL_CONFIG.FETCH_CITYMUN_BARANGAY;
        // console.log("Barangay URL: ", apiUrl);
        break;
      default:
      // console.log("Invalid fetch method!");
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
    // console.log("Regions:", response);
    response.forEach((region) => {
      const option = document.createElement("option");
      option.value = region.code;
      option.textContent = region.name;
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
    fetchMethod: "FETCH_REGION_SUBDATA",
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
