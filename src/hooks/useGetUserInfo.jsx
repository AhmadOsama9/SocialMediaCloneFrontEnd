

export const useGetUserInfo = () => {
    
    const getUserNickname = async (userId) => {
        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/getnickname?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });

        const json = await response.json();
        if (!response.ok) {
            alert("Error: ", json.error);
        } else {
            return json.nickname;
        }
    }

    return { getUserNickname };
}