from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, UserUpdate, Token, LoginRequest
from ..security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token yaroqsiz yoki muddati tugagan",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    if getattr(user, "is_blocked", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Hisobingiz bloklangan: {user.block_reason or 'Administrator tomonidan bloklangan'}",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hisobingiz vaqtincha muzlatilgan. Iltimos, ma'muriyat bilan bog'laning.",
        )
    return user


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu username allaqachon band",
        )

    if user_data.email:
        email_exists = db.query(User).filter(User.email == user_data.email).first()
        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu email allaqachon ro'yxatdan o'tgan",
            )

    new_user = User(
        email=user_data.email or None,
        username=user_data.username,
        phone=user_data.phone or None,
        full_name=user_data.full_name or None,
        university=user_data.university or None,
        level=user_data.level or None,
        grade=user_data.grade,
        hashed_password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Assign unique Student ID and distinct avatar
    new_user.student_id = f"T{new_user.id:06d}"
    new_user.avatar_url = f"https://api.dicebear.com/7.x/bottts/svg?seed={new_user.student_id}"
    db.commit()
    db.refresh(new_user)

    return new_user



@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username yoki parol noto'g'ri",
        )

    if getattr(user, "is_blocked", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Hisobingiz bloklangan: {user.block_reason or 'Administrator tomonidan bloklangan'}",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hisobingiz vaqtincha muzlatilgan. Iltimos, ma'muriyat bilan bog'laning.",
        )

    token = create_access_token(user.id)
    return Token(access_token=token)


@router.post("/login/json", response_model=Token)
def login_json(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username yoki parol noto'g'ri",
        )

    if getattr(user, "is_blocked", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Hisobingiz bloklangan: {user.block_reason or 'Administrator tomonidan bloklangan'}",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hisobingiz vaqtincha muzlatilgan. Iltimos, ma'muriyat bilan bog'laning.",
        )

    token = create_access_token(user.id)
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.student_id or not current_user.avatar_url:
        if not current_user.student_id:
            current_user.student_id = f"T{current_user.id:06d}"
        if not current_user.avatar_url:
            current_user.avatar_url = f"https://api.dicebear.com/7.x/bottts/svg?seed={current_user.student_id}"
        db.commit()
        db.refresh(current_user)
    return current_user



@router.put("/me", response_model=UserOut)
def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in user_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user