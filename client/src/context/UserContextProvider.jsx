import React from "react";
import UserContexts from "./UserContext";

const UserContextProvider = ({children}) => {
     
    return(
        <UserContexts.Provider>
        {children}
        </UserContexts.Provider>
    )
}

export default UserContextProvider;