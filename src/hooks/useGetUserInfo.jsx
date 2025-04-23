import notification from "../helperComponent/notification";

export const useGetUserInfo = () => {
    
    const getUserNickname = async (userId) => {
        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getnickname?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });

        const json = await response.json();
        if (!response.ok) {
            notification.error("Error: ", json.error);
        } else {
            return json.nickname;
        }
    }

    return { getUserNickname };
}