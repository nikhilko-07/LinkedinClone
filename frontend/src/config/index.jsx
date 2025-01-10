import axios from "axios";

export const BASE_URL = "https://linkedinclone-56pr.onrender.com";

export const clientServer = axios.create({
    baseURL: BASE_URL,
})