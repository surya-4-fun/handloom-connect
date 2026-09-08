from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class ProductRecommendation(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: Optional[str] = None
    productId: Optional[str] = None
    title: str
    craft: str
    price: str
    category: Optional[str] = None
    reason: Optional[str] = None

class ChatMessage(BaseModel):
    sender: str
    text: str

class ProductContext(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: str = Field(..., max_length=100)
    name: str = Field(..., max_length=200)
    category: Optional[str] = Field(None, max_length=100)
    price: Optional[str] = Field(None, max_length=50)
    material: Optional[str] = Field(None, max_length=150)
    region: Optional[str] = Field(None, max_length=150)
    technique: Optional[str] = Field(None, max_length=150)
    description: Optional[str] = Field(None, max_length=1000)
    care: Optional[str] = Field(None, max_length=250)
    provenance: Optional[str] = Field(None, max_length=250)
    in_stock: Optional[bool] = None
    artisan_name: Optional[str] = Field(None, max_length=150)

class ArtisanContext(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: str = Field(..., max_length=100)
    name: str = Field(..., max_length=150)
    title: Optional[str] = Field(None, max_length=200)
    region: Optional[str] = Field(None, max_length=150)
    craft: Optional[str] = Field(None, max_length=150)
    specialty: Optional[str] = Field(None, max_length=250)
    experience: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    techniques: Optional[List[str]] = Field(default_factory=list, max_length=10)

class RawMaterialContext(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: str = Field(..., max_length=100)
    name: str = Field(..., max_length=200)
    category: Optional[str] = Field(None, max_length=100)
    material_type: Optional[str] = Field(None, max_length=150)
    origin: Optional[str] = Field(None, max_length=150)
    quality: Optional[str] = Field(None, max_length=100)
    price: Optional[str] = Field(None, max_length=50)
    sustainability_info: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = Field(None, max_length=1000)
    supplier_name: Optional[str] = Field(None, max_length=150)

class CandidateProductContext(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: str = Field(..., max_length=100)
    name: str = Field(..., max_length=200)
    craft: Optional[str] = Field(None, max_length=150)
    price: Optional[str] = Field(None, max_length=50)
    region: Optional[str] = Field(None, max_length=150)
    material: Optional[str] = Field(None, max_length=150)
    category: Optional[str] = Field(None, max_length=100)
    in_stock: Optional[bool] = None
    description: Optional[str] = Field(None, max_length=350)

class CandidateMaterialContext(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: str = Field(..., max_length=100)
    name: str = Field(..., max_length=200)
    category: Optional[str] = Field(None, max_length=100)
    material_type: Optional[str] = Field(None, max_length=150)
    origin: Optional[str] = Field(None, max_length=150)
    quality: Optional[str] = Field(None, max_length=100)
    price: Optional[str] = Field(None, max_length=50)
    quantity_unit: Optional[str] = Field(None, max_length=50)
    in_stock: Optional[bool] = None
    description: Optional[str] = Field(None, max_length=350)
    denier_or_count: Optional[str] = Field(None, max_length=100)
    supplier_name: Optional[str] = Field(None, max_length=150)

class MaterialRecommendation(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: str
    name: str
    category: Optional[str] = None
    price: str
    unit: Optional[str] = None
    origin: Optional[str] = None
    reason: Optional[str] = None

class UserPreferencesContext(BaseModel):
    model_config = ConfigDict(extra='ignore')
    currency: Optional[str] = Field(None, max_length=10)
    theme: Optional[str] = Field(None, max_length=20)

class ApplicationContext(BaseModel):
    model_config = ConfigDict(extra='ignore')
    currentPage: Optional[str] = Field(None, max_length=50)
    userRole: Optional[str] = Field(None, max_length=20)
    selectedProduct: Optional[ProductContext] = None
    selectedArtisan: Optional[ArtisanContext] = None
    selectedRawMaterial: Optional[RawMaterialContext] = None
    productCandidates: Optional[List[CandidateProductContext]] = Field(default=None, max_length=6)
    materialCandidates: Optional[List[CandidateMaterialContext]] = Field(default=None, max_length=6)
    userPreferences: Optional[UserPreferencesContext] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="The user's message")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Previous conversation history")
    context: Optional[ApplicationContext] = Field(default=None, description="Structured application context")

class ChatResponseData(BaseModel):
    model_config = ConfigDict(extra='ignore')
    reply: str
    suggestions: Optional[List[ProductRecommendation]] = None
    materialSuggestions: Optional[List[MaterialRecommendation]] = None

class ChatResponse(BaseModel):
    success: bool
    message: str
    data: ChatResponseData
