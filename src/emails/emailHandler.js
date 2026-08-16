import { email } from "zod";
import { resendClient, sender } from "../config/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";
import { AppError } from "../utils/AppError.js";

export const sendWelcomeEmail = async (email, name, clientUrl) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to devPost connect",
        html: createWelcomeEmailTemplate(name, clientUrl)
    });

    if(error){
        console.log("Error sending welcome email: ", error);
        throw new AppError("Failed to send welcome email", 401);
    }

    console.log("Welcome Email sent successfully", data);
}