This app consists of two parts:
- Frontend: written in React and hosted in Netlify. It fetches the content of the http://tervingo.com/Felisarium/input.txt hosted at Byeth. It has a button to upload the edited contents 
back to this file by using a Flask route /upload (backend).
- Backend: written in Python/Flask and hosted in Render. It uploads the edited contents passed by the frontend app via FTP to the input.txt

