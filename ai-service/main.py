import os
import logging
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import ChatRequest, ChatResponse, ChatResponseData
from provider import get_ai_provider, BaseAIProvider

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Handloom Connect AI Service",
    description="FastAPI service for Handloom Connect AI features",
    version="1.0.0"
)

# Environment & CORS configuration
raw_cors_origins = os.getenv("AI_CORS_ORIGINS") or os.getenv("CORS_ORIGINS") or os.getenv("FRONTEND_URL")
is_production = os.getenv("ENVIRONMENT", "").lower() == "production" or os.getenv("NODE_ENV", "").lower() == "production"

if raw_cors_origins:
    allowed_origins = [o.strip().rstrip("/") for o in raw_cors_origins.split(",") if o.strip()]
elif not is_production:
    # Default local origins for development
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:4173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000",
    ]
else:
    # In production without explicit origins, do not expose to browser origins
    allowed_origins = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=bool(allowed_origins),
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify service is running.
    Does not invoke external AI provider.
    """
    provider_name = os.getenv("AI_PROVIDER", "mock").lower().strip()
    return {
        "status": "healthy", 
        "service": "Handloom Connect AI Service",
        "configured_provider": provider_name
    }

@app.post("/api/ai/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, provider: BaseAIProvider = Depends(get_ai_provider)):
    """
    Main chat endpoint. Takes a message, history, and context, 
    and returns a response from the configured AI provider.
    """
    # Enforce non-empty/non-whitespace validation
    stripped_message = request.message.strip()
    if not stripped_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty or only whitespace")
        
    if len(stripped_message) > 1000:
        raise HTTPException(status_code=400, detail="Message too long (max 1000 characters)")

    try:
        logger.info("Processing chat request (length: %d chars)", len(stripped_message))
        
        res = await provider.generate_response(
            message=stripped_message,
            history=request.history or [],
            context=request.context or {}
        )
        
        reply = res[0]
        suggestions = res[1] if len(res) > 1 else None
        material_suggestions = res[2] if len(res) > 2 else None
        
        return ChatResponse(
            success=True,
            message="Successfully generated response",
            data=ChatResponseData(
                reply=reply,
                suggestions=suggestions,
                materialSuggestions=material_suggestions
            )
        )
        
    except HTTPException:
        # Re-raise explicit HTTPExceptions from provider validation / status codes
        raise
    except Exception as e:
        # Sanitize unexpected internal errors so internal details/traces are never exposed
        logger.error("Unexpected error in chat endpoint: %s", type(e).__name__)
        raise HTTPException(status_code=500, detail="An error occurred while generating the AI response")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
