import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "app_title": "AIBikeFitter",
            "subtitle": "Professional AI-Powered Bike Fit Advice",
            "login_google": "Sign in with Google",
            "logout": "Sign out",
            "select_pain_points": "Select your pain points on the 3D model",
            "pain_level": "Pain Severity (1-5)",
            "remarks_optional": "Remarks (optional)",
            "add_pain_point": "Add Pain Point",
            "get_advice": "Get AI Advice",
            "your_history": "Your Bike Fit History",
            "new_fit": "New Bike Fit",
            "dashboard": "Dashboard",
            "loading": "Loading...",
            "ai_advice": "AI Bike Fitter Advice",
            "no_history": "You haven't requested any bike fits yet.",
            "chat_placeholder": "Ask a follow-up question...",
            "send": "Send",
            "saving": "Saving...",
            "error": "An error occurred. Please try again."
        }
    },
    nl: {
        translation: {
            "app_title": "AIBikeFitter",
            "subtitle": "Professioneel AI-Gedreven Fietsafstellingsadvies",
            "login_google": "Aanmelden met Google",
            "logout": "Afmelden",
            "select_pain_points": "Selecteer je pijnpunten op het 3D model",
            "pain_level": "Pijn Ernst (1-5)",
            "remarks_optional": "Opmerkingen (optioneel)",
            "add_pain_point": "Pijnpunt Toevoegen",
            "get_advice": "Krijg AI Advies",
            "your_history": "Jouw Fietsafstelling Geschiedenis",
            "new_fit": "Nieuwe Fietsafstelling",
            "dashboard": "Dashboard",
            "loading": "Laden...",
            "ai_advice": "AI Fietsafsteller Advies",
            "no_history": "Je hebt nog geen fietsafstellingsadvies aangevraagd.",
            "chat_placeholder": "Stel een vervolgvraag...",
            "send": "Verstuur",
            "saving": "Opslaan...",
            "error": "Er is een fout opgetreden. Probeer het opnieuw."
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
