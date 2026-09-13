import httpx

from .config import settings


async def chat_completion(system: str, user: str, temperature: float = 0.7) -> str:
    if not settings.OPENAI_API_KEY:
        return ""

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            url = f"{settings.OPENAI_BASE_URL.rstrip('/')}/chat/completions"
            resp = await client.post(
                url,
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
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
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception:
        return ""
