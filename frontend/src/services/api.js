

const API_URL = "http://localhost:3000/api";



export const loginUser = async (
    email,
    password
) => {
    try {
        const response = await fetch(
            `${API_URL}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );


        return await response.json();


    } catch (error) {
        console.error(
            "Login Error:",
            error
        );
    }
};

export const signupUser = async (
    userData
) => {
    try {
        const response = await fetch(
            `${API_URL}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    name: userData.name,
                    business_name:
                        userData.company_name,
                    whatsapp_number:
                        userData.code +
                        userData.whatsapp,
                    email: userData.email,
                    password:
                        userData.password,
                }),
            }
        );


        return await response.json();


    } catch (error) {
        console.error(
            "Signup Error:",
            error
        );
    }
};

export const getUserProfile =
    async (userId) => {
        try {
            const response = await fetch(
                `${API_URL}/users/${userId}`
            );


            return await response.json();
        } catch (error) {
            console.error(error);
        }


    };

export const updateUserProfile =
    async (userId, userData) => {
        try {
            const response = await fetch(
                `${API_URL}/users/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        userData
                    ),
                }
            );


            return await response.json();
        } catch (error) {
            console.error(error);
        }


    };

export const changePassword =
    async (
        userId,
        currentPassword,
        newPassword
    ) => {
        try {
            const response = await fetch(
                `${API_URL}/users/${userId}/password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );


            return await response.json();
        } catch (error) {
            console.error(error);
        }


    };

// ===============================
// WHATSAPP CRM APIs
// ===============================

export const getCustomers = async () => {
    const response = await fetch(
        `http://localhost:3000/api/whatsapp/customers`
    );

    return await response.json();
};

export const getConversations = async () => {
    const response = await fetch(
        `http://localhost:3000/api/whatsapp/conversations`
    );

    return await response.json();
};

export const getMessages = async (conversationId) => {
    const response = await fetch(
        `http://localhost:3000/api/whatsapp/messages/${conversationId}`
    );

    return await response.json();
};

export const sendWhatsAppMessage =
    async (
        to,
        message,
        conversationId
    ) => {

        const response =
            await fetch(
                "http://localhost:3000/api/whatsapp/send-message",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        to,
                        message,
                        conversationId,
                    }),
                }
            );

        return await response.json();

    };