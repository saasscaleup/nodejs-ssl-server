require('dotenv').config();

// Access environment variables
const usernameVic = process.env.USERNAME;
const passwordVic = process.env.PASSWORD;

var token, idUser, idSite;


// Use async/await to handle the asynchronous call
async function fetchData() {
  if (token !== 0){
    try {
      await get_installations();
      await get_Chart();
    } catch (error) {
      // Handle errors if needed
      console.error(error);
    }
  } else {
    try {
      await get_login_token();
      await get_installations();
      await get_Chart();
    } catch (error) {
      // Handle errors if needed
      console.error(error);
    }
  }
}


async function get_login_token() {
  console.log("Get Login Token and Used ID")
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "username": usernameVic,
    "password": passwordVic,
    "remember_me": "true"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch("https://vrmapi.victronenergy.com/v2/auth/login/", requestOptions);
    const result = await response.text();
    const data = JSON.parse(result); // result is a JSON string
    token = data.token
    idUser = data.idUser
  } catch (error) {
    console.log('error', error);
    throw error; // Rethrow the error to handle it outside this function if needed
  }
}

async function get_installations() {
  console.log("Get Installation #")
  const headers = { 'X-Authorization': `Bearer ${token}` };

  var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`https://vrmapi.victronenergy.com/v2/users/${idUser}/installations`, requestOptions);
    const result = await response.text();
    const data = JSON.parse(result); // result is a JSON string
    idSite = data.records[0].idSite  
  } catch (error) {
    console.log('error', error);
    throw error; // Rethrow the error to handle it outside this function if needed
  }
}

async function get_Overall_Stats() {
  console.log("Get Overall Stats")
  const headers = { 'X-Authorization': `Bearer ${token}` };
  var stat_data;
  var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`https://vrmapi.victronenergy.com/v2/installations/${idSite}/overallstats`, requestOptions);
    const result = await response.text();
    stat_data = JSON.parse(result); // result is a JSON string
  } catch (error) {
    console.log('error', error);
    throw error; // Rethrow the error to handle it outside this function if needed
  }
  console.log(JSON.stringify(stat_data, null, 2));
}

async function get_Chart() {
  console.log("Get Chart")
  const headers = { 'X-Authorization': `Bearer ${token}` };
  var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`https://vrmapi.victronenergy.com/v2/installations/${idSite}/diagnostics`, requestOptions);
    const result = await response.text();
    data = JSON.parse(result); // result is a JSON string
    console.log("chart", data)
    if (!data.success) {
      throw new Error('The returned response did not indicate a success.');
    }
    
    if (!data.records?.length) {
      throw new Error('The response data array is either missing or empty.');
    }
    const desiredAttributes = [
      81, // Voltage
      49, // Current
      51, // State of charge
      94, //Daily Yield
      96, //Yesterdays Daily Yield
      442, //PV Power
  
    ];
    let dataArray = []
    for (const record of data.records) {
      if (!desiredAttributes.includes(record.idDataAttribute)) {
        continue;
      }

      console.log(record.idDataAttribute, record.description, record.formattedValue);
      dataArray.push([record.idDataAttribute, record.description, record.formattedValue])
    }
    return dataArray
  } catch (error) {
    console.log('error', error);
    throw error; // Rethrow the error to handle it outside this function if needed
  }
}

fetchData();