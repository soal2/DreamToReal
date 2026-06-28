from pydantic import BaseModel, Field


class DreamCreateRequest(BaseModel):
    raw_text: str = Field(..., description="用户原始梦境碎片")
    source: str = Field(default="text", description="text 或 voice")
    generate_image: bool = False


class DreamReorganizeRequest(BaseModel):
    style: str | None = None


class DreamGenerateImageRequest(BaseModel):
    use_mock: bool = False


class DreamRecordResponse(BaseModel):
    id: str
    title: str
    raw_text: str
    organized_text: str
    image_prompt: str
    image_url: str
    keywords: list[str]
    emotions: list[str]
    scenes: list[str]
    source: str
    status: str
    created_at: str
    updated_at: str


class DreamListItem(BaseModel):
    id: str
    title: str
    image_url: str
    keywords: list[str]
    emotions: list[str]
    scenes: list[str]
    status: str
    created_at: str


class DreamListResponse(BaseModel):
    items: list[DreamListItem]
    total: int
    limit: int
    offset: int


class DreamImageResponse(BaseModel):
    id: str
    image_url: str
    status: str

