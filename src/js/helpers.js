//This module contains functions that are reusable all over the project
import {TIMEOUT_SEC} from "./config";

import { async } from "regenerator-runtime";


// Setting the timeout to make the request fail after a certan number of seconds
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};


export const getJSON=async  function(url){
    try{
        // const fecth=fetch(url);
        const res=await Promise.race([fetch(url),timeout(TIMEOUT_SEC)]);
        const data=await res.json();

        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return data;

    }catch(err){
      console.error("Took to long the request failed")
      throw err;
    }
}


export const sendJSON=async  function(url,uploadData){
  try{
      const fetchPro=fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(uploadData)
      });
      const res=await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]);
      const data=await res.json();

      if(!res.ok) throw new Error(`${data.message} ${res.status}`);
      return data;

  }catch(err){
    console.error("Took to long the request failed")
    throw err;
  }
}