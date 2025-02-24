from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import numpy as np
from typing import Optional
import torch

app = FastAPI(title="AI Content Generator API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API keys predefinidas para modelos gratuitos
FREE_MODEL_API_KEYS = {
    "gpt2": "demo_gpt2_key_123",
    "bloom": "demo_bloom_key_456"
}

class ContentRequest(BaseModel):
    prompt: str
    content_type: str
    length: int = 100
    model: str = "gpt2"
    api_key: Optional[str] = None

# Diccionario de modelos disponibles
MODEL_CONFIGS = {
    "gpt2": {
        "name": "gpt2",
        "requires_api_key": False,
        "max_length": 1000,
        "description": "Modelo base de OpenAI para generación de texto"
    },
    "gpt3": {
        "name": "text-davinci-003",
        "requires_api_key": True,
        "max_length": 4000,
        "description": "Modelo avanzado de OpenAI con mayor capacidad"
    },
    "gpt4": {
        "name": "gpt-4",
        "requires_api_key": True,
        "max_length": 8000,
        "description": "Última versión del modelo GPT con capacidades multimodales"
    },
    "llama2": {
        "name": "meta-llama/Llama-2-7b-chat-hf",
        "requires_api_key": True,
        "max_length": 4000,
        "description": "Modelo de código abierto de Meta"
    },
    "claude": {
        "name": "anthropic/claude-2",
        "requires_api_key": True,
        "max_length": 100000,
        "description": "Modelo de Anthropic con enfoque en seguridad"
    },
    "deepseek": {
        "name": "deepseek-ai/deepseek-coder-6.7b-base",
        "requires_api_key": True,
        "max_length": 4000,
        "description": "Especializado en generación de código y texto técnico"
    },
    "bloom": {
        "name": "bigscience/bloom-560m",
        "requires_api_key": False,
        "max_length": 2000,
        "description": "Modelo multilingüe de código abierto"
    }
}

# Inicializar modelos por defecto
default_models = {
    "gpt2": pipeline('text-generation', model='gpt2'),
    "bloom": pipeline('text-generation', model='bigscience/bloom-560m')
}

def get_content_prompt(content_type: str, prompt: str) -> str:
    prefixes = {
        "article": "Escribe un artículo detallado sobre: ",
        "story": "Crea una historia cautivadora sobre: ",
        "poem": "Compone un poema inspirador sobre: ",
        "script": "Desarrolla un guión dramático sobre: ",
        "email": "Redacta un correo electrónico profesional sobre: ",
        "description": "Genera una descripción detallada de: "
    }
    return f"{prefixes.get(content_type, '')}{prompt}"

@app.get("/")
async def read_root():
    return {
        "message": "Bienvenido al AI Content Generator API",
        "version": "2.0",
        "models_available": len(MODEL_CONFIGS)
    }

@app.post("/generate")
async def generate_content(request: ContentRequest):
    try:
        model_config = MODEL_CONFIGS.get(request.model)
        if not model_config:
            raise HTTPException(status_code=400, detail="Modelo no soportado")

        # Validación de API key
        if model_config["requires_api_key"]:
            if not request.api_key:
                raise HTTPException(status_code=400, detail="Este modelo requiere una API key")
        else:
            # Verificar que la API key coincida con la predefinida para modelos gratuitos
            expected_key = FREE_MODEL_API_KEYS.get(request.model)
            if request.api_key != expected_key:
                raise HTTPException(status_code=401, detail="API key inválida para modelo gratuito")

        length = min(request.length, model_config["max_length"])
        formatted_prompt = get_content_prompt(request.content_type, request.prompt)

        if request.model in default_models:
            generator = default_models[request.model]
            generated_text = generator(
                formatted_prompt,
                max_length=length,
                num_return_sequences=1,
                temperature=0.8,
                top_p=0.9,
                repetition_penalty=1.2
            )
            content = generated_text[0]["generated_text"]
        else:
            # Simulación para modelos que requieren API
            content = f"[Usando modelo {request.model}]\n\n" + default_models["gpt2"](
                formatted_prompt,
                max_length=length,
                num_return_sequences=1
            )[0]["generated_text"]

        return {
            "status": "success",
            "content": content,
            "model_used": request.model,
            "model_info": model_config
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def get_available_models():
    return {
        "models": MODEL_CONFIGS,
        "total_models": len(MODEL_CONFIGS),
        "free_models": [k for k, v in MODEL_CONFIGS.items() if not v["requires_api_key"]]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": list(default_models.keys())
    } 