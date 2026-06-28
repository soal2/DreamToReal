from fastapi import APIRouter, Depends, Query, Response, status

from app.api.deps import (
    get_dream_delete_service,
    get_dream_generation_service,
    get_dream_query_service,
    get_image_generation_service,
)
from app.schemas.dream import (
    DreamCreateRequest,
    DreamGenerateImageRequest,
    DreamImageResponse,
    DreamListItem,
    DreamListResponse,
    DreamRecordResponse,
    DreamReorganizeRequest,
)
from app.services.dream_delete_service import DreamDeleteService
from app.services.dream_generation_service import DreamGenerationService
from app.services.dream_query_service import DreamQueryService
from app.services.image_generation_service import ImageGenerationService

router = APIRouter(prefix="/dreams", tags=["dreams"])


@router.post("", response_model=DreamRecordResponse, status_code=status.HTTP_201_CREATED)
def create_dream(
    request: DreamCreateRequest,
    service: DreamGenerationService = Depends(get_dream_generation_service),
):
    return service.create_dream(request)


@router.get("", response_model=DreamListResponse)
def list_dreams(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    service: DreamQueryService = Depends(get_dream_query_service),
):
    records, total = service.list_dreams(limit=limit, offset=offset)
    return DreamListResponse(
        items=[
            DreamListItem(
                id=record.id,
                title=record.title,
                image_url=record.image_url,
                keywords=record.keywords,
                emotions=record.emotions,
                scenes=record.scenes,
                status=record.status,
                created_at=record.created_at,
            )
            for record in records
        ],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/{dream_id}", response_model=DreamRecordResponse)
def get_dream(
    dream_id: str,
    service: DreamQueryService = Depends(get_dream_query_service),
):
    return service.get_dream(dream_id)


@router.post("/{dream_id}/reorganize", response_model=DreamRecordResponse)
def reorganize_dream(
    dream_id: str,
    request: DreamReorganizeRequest | None = None,
    service: DreamGenerationService = Depends(get_dream_generation_service),
):
    return service.reorganize_dream(dream_id)


@router.post("/{dream_id}/generate-image", response_model=DreamImageResponse)
def generate_dream_image(
    dream_id: str,
    request: DreamGenerateImageRequest | None = None,
    service: ImageGenerationService = Depends(get_image_generation_service),
):
    updated = service.generate_for_dream(dream_id, use_mock=request.use_mock if request else False)
    return DreamImageResponse(id=updated.id, image_url=updated.image_url, status=updated.status)


@router.delete("/{dream_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dream(
    dream_id: str,
    service: DreamDeleteService = Depends(get_dream_delete_service),
):
    service.delete_dream(dream_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

