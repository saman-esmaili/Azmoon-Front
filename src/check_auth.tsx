import Axios from "axios";
export const CheckAuth = () =>{
    const token = localStorage.getItem('token')
    Axios.get('https://localhost:8000/authorization',{headers:{Authorization: `bearer ${token}`}})
    .then((res)=>{
        return true
    }).catch((err)=>{return false})
}
