import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import { Provider } from 'react-redux';
import { store } from './store/store';
import SummonerDetails from './pages/SummonerDetails';
import Board from './pages/Board';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import ResetPasswordForm from './pages/ResetPasswordForm';
import PatchNote from './pages/PatchNote';


const persistor = persistStore(store);

const router = createBrowserRouter([{
  path: '/',
  element: <App/>,
  errorElement: <p>Not Found</p>,
  children: [
    {index : true, path: '/', element: <Home/>},
    {path: '/patchNote', element: <PatchNote/>},
    {path: '/summoner/:id', element: <SummonerDetails/>},
    {path: '/board', element: <Board/>},
  ]
},
{
  path: '/reset/:token',
  element: <ResetPasswordForm/>
}
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
