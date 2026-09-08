import type { Request, Response } from "express";
import {
    getGoogleAuthUrl,
    getGoogleTokens
} from "../services/google.service.js";

export const googleLogin = (req: Request, res: Response) => {

    const url = getGoogleAuthUrl();

    res.redirect(url);
};


export const googleCallback = async (
    req: Request,
    res: Response
) => {

    try {

        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Google code is required"
            });
        }

        const tokens = await getGoogleTokens(code as string);

        console.log("GOOGLE TOKENS:", tokens);

        return res.status(200).json({
            success: true,
            message: `Google authentication successful, ${tokens}.`,
            tokens
        });

    } catch (error) {

        console.error("Google authentication error:", error);

        return res.status(500).json({
            success: false,
            message: "Google authentication failed"
        });
    }
};