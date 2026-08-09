import { auth } from "./firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

window.logout = async function(){

    if(!confirm("Are you sure you want to logout?")){

        return;

    }

    try{

        await signOut(auth);

        localStorage.clear();

        window.location.href="../login.html";

    }

    catch(error){

        alert(error.message);

    }

}