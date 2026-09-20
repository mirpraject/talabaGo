import logging
import httpx

from .config import settings

logger = logging.getLogger("studenthub.ai")


async def chat_completion(system: str, user: str, temperature: float = 0.7) -> str:
    gemini_key = settings.GEMINI_API_KEY
    openai_key = settings.OPENAI_API_KEY

    # Agar OPENAI_API_KEY Gemini formati (AQ. yoki AIza) bo'lsa, uni Gemini deb bilamiz
    if openai_key and (openai_key.startswith("AQ.") or openai_key.startswith("AIza")):
        if not gemini_key:
            gemini_key = openai_key
            openai_key = None

    # 1. Google Gemini orqali yaratish
    if gemini_key:
        models_to_try = [
            settings.GEMINI_MODEL,
            "gemini-3-flash-preview",
            "gemini-3.5-flash",
            "gemini-flash-latest",
        ]
        seen = set()
        ordered_models = []
        for m in models_to_try:
            if m and m not in seen:
                seen.add(m)
                ordered_models.append(m)

        for model_name in ordered_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key}"
            payload = {
                "contents": [{"role": "user", "parts": [{"text": user}]}],
                "generationConfig": {"temperature": temperature},
            }
            if system:
                payload["systemInstruction"] = {"parts": [{"text": system}]}

            try:
                async with httpx.AsyncClient(timeout=60) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                return parts[0].get("text", "").strip()
                    else:
                        logger.warning(
                            "Gemini API (%s) xatosi %s: %s",
                            model_name,
                            resp.status_code,
                            resp.text[:150],
                        )
            except Exception as e:
                logger.warning("Gemini API so'rov xatosi (%s): %s", model_name, e)

    # 2. OpenAI formati orqali yaratish
    if openai_key:
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                url = f"{settings.OPENAI_BASE_URL.rstrip('/')}/chat/completions"
                resp = await client.post(
                    url,
                    headers={
                        "Authorization": f"Bearer {openai_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": settings.OPENAI_MODEL,
                        "messages": [
                            {"role": "system", "content": system},
                            {"role": "user", "content": user},
                        ],
                        "temperature": temperature,
                    },
                )
                if resp.status_code == 200:
                    return resp.json()["choices"][0]["message"]["content"].strip()
                else:
                    logger.warning(
                        "OpenAI API xatosi %s: %s", resp.status_code, resp.text[:150]
                    )
        except Exception as e:
            logger.warning("OpenAI API so'rov xatosi: %s", e)

    return ""

