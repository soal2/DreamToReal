from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import BACKEND_DIR, settings

load_dotenv(BACKEND_DIR / ".env", override=False)

from app.api.v1 import dreams, health
from app.core.database import init_db
from app.core.exceptions import AppError
from app.data.seed_dreams import seed_demo_dreams
from app.repositories.dream_repository import DreamRepository
from app.storage.image_storage import ImageStorage


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.require_llm_credentials()
    settings.require_image_credentials()
    init_db()
    storage = ImageStorage()
    storage.ensure_mock_assets()
    seed_demo_dreams(DreamRepository(), storage)
    yield


app = FastAPI(
    title="Dream to Real Agent Backend",
    version=settings.version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings.static_dir.mkdir(parents=True, exist_ok=True)
app.mount(settings.static_url_path, StaticFiles(directory=settings.static_dir), name="static")
app.include_router(dreams.router, prefix=settings.api_v1_prefix)
app.include_router(health.router, prefix=settings.api_v1_prefix)


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message}},
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": {"code": "REQUEST_VALIDATION_FAILED", "message": "请求参数格式不正确。"}},
    )

