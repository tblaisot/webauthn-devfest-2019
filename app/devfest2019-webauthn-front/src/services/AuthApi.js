

export const sendLogout = async () => {
    const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        }
    });
    if (res.status !== 200) {
        throw new Error((await res.json()).message);
    }
    return res.json();
};

export const sendPasswordLogin = async (userLogin) => {
    const res = await fetch("/api/password/authenticate", {
      method: "POST",
      body: JSON.stringify(userLogin),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status !== 200) {
        throw new Error((await res.json()).message);
    }
    return res.json();
};

export const sendPasswordRegister = async (userRegistration) => {
    const res = await fetch("/api/password/signin", {
      method: "POST",
      body: JSON.stringify(userRegistration),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status !== 200) {
        throw new Error((await res.json()).message);
    }
    return res.json();
};


export const getWebAuthnRegistrationChallenge = async (body) => {
    const res = await fetch("/api/webauthn/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (res.status !== 200) {
        throw new Error((await res.json()).message);
    }
    return res.json();
};

export const getWebAuthnLoginChallenge =  async (body) => {
    const res = await fetch("/api/webauthn/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (res.status !== 200) {
        throw new Error((await res.json()).message);
    }
    return res.json();
};



export const sendWebAuthnResponse = async (body) => {
    const res = await fetch("/api/webauthn/response", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (res.status !== 200) {
        throw new Error((await res.json()).message);
    }
    return res.json();
};
