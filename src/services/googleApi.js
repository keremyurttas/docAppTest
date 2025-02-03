// const API_KEY = "AIzaSyDNn-oguslOMXTW1TjLoQfdKvcmlZbhiCg";
// const CLIENT_ID =
//   "460136760161-72up3nhqrg5g89k8v3jfavduli2bbd6v.apps.googleusercontent.com";

// let gapiLoaded = false;

// export function loadGapi() {
//   return new Promise((resolve, reject) => {
//     if (gapiLoaded) {
//       resolve(window.gapi);
//       return;
//     }

//     if (window.gapi) {
//       window.gapi.load("client:auth2", async () => {
//         try {
//           await window.gapi.client.init({
//             apiKey: API_KEY,
//             clientId: CLIENT_ID,
//             discoveryDocs: [
//               "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
//             ],
//             scope: "https://www.googleapis.com/auth/drive.readonly",
//           });
//           gapiLoaded = true;
//           resolve(window.gapi);
//         } catch (error) {
//           reject(error);
//         }
//       });
//     } else {
//       reject(new Error("Google API script not loaded"));
//     }
//   });
// }
