import Axios from "axios";
export const CheckAuth = async () => {
    try {
        await Axios.get("http://localhost:8000/authorization", {withCredentials:true});
        return true;
    } catch (err) {
        try {
            await Axios.post("http://localhost:8000/refresh",{},{withCredentials:true});
            return true;
        } catch (err2) {
            return false;
        }
    }
};

export const revoke = () =>{
    Axios.post('http://localhost:8000/revoke',{},{withCredentials:true})
        .then((res)=>{})
        .catch((err)=>{})
}

export const Logout = () => {
    Axios.post('http://localhost:8000/logout', {}, {withCredentials:true})
        .then((res) => {})
        .catch((err) => {})
}