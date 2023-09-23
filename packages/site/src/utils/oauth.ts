// VERIFIER API Twitter OAuth GET CALL
// /oauth-twitter/ -> fetch twitter id token after oauth
export const getTwitterID = async () => {
    window.location.replace(process.env.REACT_APP_API_BASE_URL+'/oauth-twitter');
    /*let twitterID = await fetch(
        process.env.REACT_APP_API_BASE_URL+'/oauth-twitter', {
            method: "get"//,
           // headers: {
           //     'Content-Type': 'application/json'//,
           //     'Access-Control-Allow-Origin': '*'
           // }
        }).then(response => response.json())
        .then(json => {
          console.log("Id token retrieved from twitter: "+json);
          return json;
        }).catch(error => {
          console.log(error);
          return error;
        });
        return twitterID;*/
}